//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
//memory flip card game contract

error MemoryGame__ValueNotEqaultToPrice();

contract MemoryGame {
  //game levels
  enum GameLevel {
    Easy,
    Medium,
    Hard
  }

  struct Card {
    string src;
    bool matched;
    uint256 id;
  }
  struct Player {
    uint256 score;
    bool state;
    address playerAddress;
  }
  //game struct
  struct Game {
    uint256 id;
    GameLevel gameLevel;
    Player player1;
    Player player2;
    bool gameStarted;
    bool gameFinished;
    uint256 price;
    address winner;
  }

  //games
  mapping(uint256 => Game) public gameStore;
  mapping(uint256 => Card[]) public gameCards;

  //game count
  uint256 public gameCount;

  //event
  event GameCreated(address indexed creator, uint gameId, GameLevel gameLevel);
  event GameJoined(address indexed player, uint gameId, string playerName);
  event GameStarted(uint playerInGameCount, uint gameId);
  event GameFinished(address indexed winner, uint gameId);
  event GameCancelled(address indexed player, uint gameId);
  event GameReset(address indexed player, uint gameId);
  event CardSelected(address indexed player, uint gameId, uint cardId);
  event CardMatched(address indexed player, uint gameId, uint cardId);
  event CardFlipped(address indexed player, uint gameId, bool player1State, bool player2State);

  /// @dev internal function to generate random number; used for shulling the cards and selecting a random card
  ///@dev the random number is generated using the block difficulty, timestamp and the sender's address which will be  changed to use chainlink VRF
  function _createRandomNum(uint256 _max, address _sender) internal view returns (uint256 randomValue) {
    uint256 randomNum = uint256(keccak256(abi.encodePacked(gameCount, block.timestamp, _sender)));

    randomValue = randomNum % _max;
    if (randomValue == 0) {
      randomValue = _max / 2;
    }

    return randomValue;
  }

  //shuffle cards
  function _shuffleAndDuplicateCards(uint256 gameId, uint256 _level, Card[] memory inputCards) internal {
    Card[] memory shuffledCards = new Card[](inputCards.length * _level);

    for (uint256 i = 0; i < inputCards.length; i++) {
      shuffledCards[i] = inputCards[i];
      shuffledCards[i + inputCards.length] = inputCards[i];
    }

    uint256 n = shuffledCards.length;

    for (uint256 i = 0; i < n; ) {
      uint256 j = _createRandomNum((n - i), msg.sender);
      Card memory temp = shuffledCards[j];
      shuffledCards[j] = shuffledCards[i];
      shuffledCards[i] = temp;
      unchecked {
        i++;
      }
    }

    for (uint256 i = 0; i < shuffledCards.length; ) {
      gameCards[gameId].push(shuffledCards[i]);
      unchecked {
        i++;
      }
    }
  }

  //function that creates a game
  function createGame(GameLevel _gameLevel, Card[] memory _gameCards, uint256 _price) public payable {
    //change the game id to hash
    //change the card id to hash

    if (_price < msg.value) {
      revert MemoryGame__ValueNotEqaultToPrice();
    }
    //shuffle cards
    uint256 gameId = gameCount;
    //hard coded the level to 2 for now
    _shuffleAndDuplicateCards(gameId, 2, _gameCards);

    //create a game
    Game memory game;
    game.id = gameCount;
    game.gameLevel = _gameLevel;
    game.player1 = Player(0, false, msg.sender);
    game.player2 = Player(0, false, address(0));
    game.gameStarted = false;
    game.gameFinished = false;
    game.price = _price;
    game.winner = address(0);

    //emit event
    emit GameCreated(msg.sender, gameCount, _gameLevel);
    //add game to mapping
    gameStore[gameCount] = game;
    //increment game count
    gameCount++;
  }

  modifier gameExists(uint256 _gameId) {
    require(gameCount > _gameId, "Game does not exist");
    _;
  }

  modifier gameNotStarted(uint256 _gameId) {
    require(!gameStore[_gameId].gameStarted, "Game has already started");
    _;
  }

  modifier gameNotFinished(uint256 _gameId) {
    require(!gameStore[_gameId].gameFinished, "Game has already finished");
    _;
  }

  modifier onlyGamePlayer(uint256 _gameId) {
    require(
      gameStore[_gameId].player1.playerAddress == msg.sender || gameStore[_gameId].player2.playerAddress == msg.sender,
      "You are not a player in this game"
    );
    _;
  }

  modifier gameNotCancelled(uint256 _gameId) {
    require(gameStore[_gameId].player1.playerAddress != address(0), "Game was cancelled");
    _;
  }

  modifier onlyGameCreator(uint256 _gameId) {
    require(gameStore[_gameId].player1.playerAddress == msg.sender, "You cannot cancel a game you did not create");
    _;
  }

  //function that allows player to join a game
  function joinGame(
    uint256 _gameId
  ) public gameExists(_gameId) gameNotStarted(_gameId) gameNotFinished(_gameId) gameNotCancelled(_gameId) {
    Game storage game = gameStore[_gameId];
    require(game.player1.playerAddress != msg.sender, "You cannot join your own game");
    require(game.player2.playerAddress == address(0), "You are already in a game");

    game.player2 = Player(0, false, msg.sender);
    emit GameJoined(msg.sender, _gameId, "player2");

    if (game.player2.playerAddress != address(0)) {
      game.gameStarted = true;
      emit GameStarted(_gameId, 2);
    }
  }

  //function(gameId, choiceOne, choiceTwo) that allows a player to make a move in a game and prevent a user from making while the other player is making a move
  // it also checks if the players first flipped card id matches the second flipped card id then it sets the matched property of the card to true, then its updates the player's score and the cards

  function makeMove(
    uint256 _gameId,
    uint256 _choiceCardIdOne,
    uint256 _choiceCardIdTwo
  ) public gameExists(_gameId) gameNotCancelled(_gameId) gameNotFinished(_gameId) onlyGamePlayer(_gameId) {
    Game storage game = gameStore[_gameId];
    require(game.gameStarted, "Game has not started");
    require(!game.gameFinished, "Game has already finished");
    //prevent both players from playing
    // require(game.player1.state != game.player2.state, "Both players cannot make a move simultaneously");

    Card[] storage cards = gameCards[_gameId];
    // require(_choiceCardIdOne < cards.length && _choiceCardIdTwo < cards.length, "Invalid card ID");

    Card memory cardOne;
    Card memory cardTwo;
    for (uint256 i = 0; i < cards.length; i++) {
      if (cards[i].id == _choiceCardIdOne) {
        cardOne = cards[i];
      }
      if (cards[i].id == _choiceCardIdTwo) {
        cardTwo = cards[i];
      }
    }

    require(!cardOne.matched && !cardTwo.matched, "One or both cards already matched");
    if (cardOne.id == cardTwo.id) {
      for (uint256 i = 0; i < cards.length; i++) {
        if (cards[i].id == cardOne.id) {
          cards[i].matched = true;
          emit CardMatched(msg.sender, _gameId, cardOne.id);
        }
      }
      if (game.player1.playerAddress == msg.sender) {
        game.player1.score += 1;
      } else if (game.player2.playerAddress == msg.sender) {
        game.player2.score += 1;
      }
    }

    // Set the player's state to indicate that they have made a move
    if (game.player1.playerAddress == msg.sender) {
      require(!game.player1.state, "It's not your turn");
      game.player1.state = true;
    } else if (game.player2.playerAddress == msg.sender) {
      require(!game.player2.state, "It's not your turn");
      game.player2.state = true;
    }

    // Check if both players have made their moves
    if (game.player1.state && game.player2.state) {
      // Reset the player states for the next turn
      game.player1.state = false;
      game.player2.state = false;
    }
    //check if all cards have been matched
    bool allMatched = false;
    for (uint256 i = 0; i < cards.length; i++) {
      if (!cards[i].matched) {
        allMatched = false;
        break;
      }
      allMatched = true;
    }
    if (allMatched) {
      game.gameFinished = true;
      _checkWinner(_gameId);
      emit GameFinished(game.winner, _gameId);
    }

    emit CardFlipped(msg.sender, _gameId, game.player1.state, game.player2.state);
  }

  //check for the winner and end the game
  function _checkWinner(uint256 _gameId) public {
    Game storage game = gameStore[_gameId];
    require(game.gameStarted, "Game has not started");
    // require(!game.gameFinished, "Game has already finished");

    if (game.player1.score > game.player2.score) {
      game.winner = game.player1.playerAddress;
    } else if (game.player1.score < game.player2.score) {
      game.winner = game.player2.playerAddress;
    } else {
      game.winner = address(0);
    }
  }

  function endGame(uint256 _gameId) public gameExists(_gameId) onlyGamePlayer(_gameId) gameNotCancelled(_gameId) {
    Game storage game = gameStore[_gameId];
    require(game.gameStarted, "Game has not started");
    require(!game.gameFinished, "Game has already finished");

    game.gameFinished = true;

    // Add logic to determine the winner and update game state

    emit GameFinished(game.winner, _gameId);
  }

  function cancelGame(
    uint256 _gameId
  ) public gameExists(_gameId) onlyGameCreator(_gameId) gameNotStarted(_gameId) gameNotFinished(_gameId) {
    //send back the price to the game creator
    Game storage game = gameStore[_gameId];
    (bool sent, ) = payable(game.player1.playerAddress).call{value: game.price}("");
    require(sent, "Failed to send Ether");
    delete gameStore[_gameId];
    emit GameCancelled(msg.sender, _gameId);
  }

  //reset the game whichs resets the game state and the cards and reshuflles the cards
  function resetGame(uint256 _gameId) public gameExists(_gameId) onlyGameCreator(_gameId) {
    Game storage game = gameStore[_gameId];
    require(game.gameFinished, "Game has not finished");
    game.gameFinished = false;
    game.player1.state = false;
    game.player2.state = false;
    game.player1.score = 0;
    game.player2.score = 0;
    game.winner = address(0);
    Card[] storage cards = gameCards[_gameId];
    for (uint256 i = 0; i < cards.length; i++) {
      cards[i].matched = false;
    }

    //shuffle the cards
    for (uint256 i = 0; i < cards.length; i++) {
      uint256 rand = _createRandomNum((cards.length - i), msg.sender);
      Card memory temp = cards[rand];
      cards[rand] = cards[i];
      cards[i] = temp;
    }
    emit GameReset(msg.sender, _gameId);
  }

  //getter functions

  function getGameCards(uint256 _gameId) public view returns (Card[] memory) {
    return gameCards[_gameId];
  }
}
