/**
 * Copyright 2013 Michael N. Gagnon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// TODO: Put in Direction.js

Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}

function rotateLeft(direction) {
  if (direction == Direction.LEFT) {
    return Direction.DOWN
  } else if (direction == Direction.DOWN) {
    return Direction.RIGHT
  } else if (direction == Direction.RIGHT) {
    return Direction.UP
  } else if (direction == Direction.UP) {
    return Direction.LEFT
  } else {
    // assert false
  }
}

function rotateRight(direction) {
  if (direction == Direction.LEFT) {
    return Direction.UP
  } else if (direction == Direction.UP) {
    return Direction.RIGHT
  } else if (direction == Direction.RIGHT) {
    return Direction.DOWN
  } else if (direction == Direction.DOWN) {
    return Direction.LEFT
  } else {
    // assert false
  }
}

function rotateDirection(oldDirection, rotateDirection) {
  if (rotateDirection == Direction.LEFT) {
    return rotateLeft(oldDirection)
  } else if (rotateDirection == Direction.RIGHT) {
    return rotateRight(oldDirection)
  } else {
    // assert false
  }
}

function turnBot(bot, direction) {
  var oldFacing = bot.facing
  bot.facing = rotateDirection(bot.facing, direction)
  var animationData = new AnimationTurn(oldFacing, bot.facing)
  bot.animation = new Animation(AnimationType.ROTATE, animationData)
}

// executes the 'move' instruciton on the bot
// updates the bot state
function moveBot(bot) {

  var prevX = bot.cellX
  var prevY = bot.cellY

  var dx = 0
  var dy = 0
  if (bot.facing == Direction.UP) {
    dy = -1
  } else if (bot.facing == Direction.DOWN) {
    dy = 1
  } else if (bot.facing == Direction.LEFT) {
    dx = -1
  } else if (bot.facing == Direction.RIGHT) {
    dx = 1
  } else {
    // assert(false)
  }

  xResult = wrapAdd(bot.cellX, dx, ccx)
  yResult = wrapAdd(bot.cellY, dy, ccy)
  bot.cellX = xResult[0]
  bot.cellY = yResult[0]
  xTorus = xResult[1]
  yTorus = yResult[1]

  animationData = new AnimationMove(
    xTorus == "torus" || yTorus == "torus",
    prevX, prevY,
    bot.cellX - dx, bot.cellY - dy,
    prevX + dx, prevY + dy,
    dx, dy) 

  bot.animation = new Animation(AnimationType.MOVE, animationData)
}

// assumes relatively sane values for increment
// returns [value, moveType]
// where moveType == "moveTorus" or "moveNonTorus"
function wrapAdd(value, increment, outOfBounds) {
  value += increment
  if (value >= outOfBounds) {
    return [value % outOfBounds, "torus"]
  } else if (value < 0) {
    return [outOfBounds + value, "torus"]
  } else {
    return [value, "nonTorus"]
  }
}


function Bot(x, y, facing, program) {

    this.cellX = x;
    this.cellY = y
    this.facing = facing;
    // an array of strings, each string is an "instruction"
    this.program = program;
    // instruction pointer points to the next instruction to be executed
    this.ip = 0;

    // the next animation to perform for this bot
    this.animation = "";
}

// TODO: do a better job separating model from view.
function step(bots) {
  // TODO: determine for each for javascript
  var numBots = bots.length
  for (var i = 0; i < numBots; i++) {
    var bot = bots[i]

    var instruction = bot.program[bot.ip]
    bot.ip = (bot.ip + 1) % bot.program.length
    bot.animation = new Animation(AnimationType.NONE, null)
    if (instruction == "move") {
      moveBot(bot)
    } else if (instruction == "left") {
      turnBot(bot, Direction.LEFT)
    } else if (instruction == "right") {
      turnBot(bot, Direction.RIGHT)
    }
  }
}