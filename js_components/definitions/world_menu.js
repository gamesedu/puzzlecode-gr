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

// show or hide the level menu, depending on whether or not multiple
// levels can be played
function setupLevelSelect(state) {

  var visibleWorlds = _.keys(state.visibility)
  if (visibleWorlds.length == 1 &&
    _.keys(state.visibility[visibleWorlds[0]]).length == 1) {
    //$("#accordionLevelSelect").attr("style", "display: none;")
  } else {
    $("#accordionLevelSelect").removeAttr("style")
  } 
}

function getCompletedClass(completed) {
  if (completed) {
    return "icon-ok"
  } else {
    return "icon-minus"
  }
}

function getWorldNameHtml(world_index, name, completed) {
  var completedClass = getCompletedClass(completed)

  var worldName = "World "
    + (parseInt(world_index) + 1)
    + ": "
    + name

  return '<i class="' + completedClass + '"></i> '
      + worldName
      +  '<span class="caret world-menu-caret"></span>'
}

/**
 * worldId: the id for the newly created world menu object (do not include '#')
 * text: the name of the world, e.g. "World 1: Move &amp; Turn"
 * completed: true iff world is completed, false otherwise
 */
function addWorldToMenu(campaign, state, world_index) {

  var world = campaign[world_index]

  // determine if the world has been completed
  var worldCompleted = true
  for (level_index in state.visibility[world_index]) {
    if (!state.visibility[world_index][level_index]) {
      worldCompleted = false
    }
  }

  $("#levelmenu")
    .append(
      '<li id="' + world.id + '">'
      +  '<div class="btn-group">'
      +    '<a class="btn dropdown-toggle level-select"'
      +       'data-toggle="dropdown" href="#">'
      +       getWorldNameHtml(world_index, world.name, worldCompleted)
      +    '</a>'
      +    '<ul class="dropdown-menu">'
      +    '</ul>'
      +  '</div>'
      + '</li>')

}

/**
 * Add a check mark to a level
 */
function worldMenuCheckWorld(campaign, world_index) {
  var world = campaign[world_index]

  $("#" + world.id)
    .find(".btn")
    .html(getWorldNameHtml(world_index, world.name, true))

}

function getLevelNameHtml(world_index, level_index, name, completed) {
  var completedClass = getCompletedClass(completed)
  var levelName = "Level "
    + (parseInt(world_index) + 1)
    + "-"
    + (parseInt(level_index) + 1)
    + ": " + name

  return '<a tabindex="-1" href="#">'
      + '<i class="' + completedClass + '"></i> '
      + levelName
      + '</a>'
}

// TODO: BUG: addLevelToMenu keeps getting called even when the level
// has already been added
function addLevelToMenu(campaign, state, world_index, level_index) {

  var completed = state.visibility[world_index][level_index]

  var world = campaign[world_index]
  var level = world.levels[level_index]

  $("#" + world.id)
    .find(".dropdown-menu")
    .append('<li id="' + level.id + '">'
      + getLevelNameHtml(world_index, level_index, level.name, completed)
      + '</li>')
}

/**
 * Add a check mark to a level
 */
function worldMenuCheckLevel(campaign, world_index, level_index) {
  var level = campaign[world_index].levels[level_index]

  $("#" + level.id)
    .html(getLevelNameHtml(world_index, level_index, level.name, true))

}

