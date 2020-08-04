/* @source https://gist.github.com/tpae/72e1c54471e88b689f85ad2b3940a8f0 */

/* Create Trie class */
var Trie = function () {
  var that = Object.create(Trie.prototype);
  that.children = {}; // mapping: next character -> child nodes
  that.isWord = false;
  
  /* Insert one word. */
  that.insertWord = function (word) {
    var current_node = that;
    for (var i = 0; i < word.length; i++) {
      var character = word[i]
      // if character is not in the trie already, add it
      if (!(character in current_node.children)) {
        current_node.children[character] = Trie();
      }
      // update current_node
      current_node = current_node.children[character];
    };

      // after adding all the chars of the word,
      // you are at the end of a word
      current_node.isWord = true;
    }

    /* Insert a list of words. */
    that.insertWords = function (words) {
      for (var i = 0; i < words.length; i++) {
        that.insertWord(words[i]);
      }
    }

    /* Get the node that a word is located at. */
    that.getNode = function (word) {
      // Start at the root
      var current_node = that;
      for (var i = 0; i < word.length; i++) {
        var character = word[i];

        // If the word's character isn't a child of the current_node,
        // The word isn't in the trie
        if (!(character in current_node.children)) {
          return;
        }
        // Move down the trie, update current_node
        current_node = current_node.children[character];
      };
      return current_node;
    }

    /* Check if trie contains words. */
    that.contains = function (word) {
      var current_node = that.getNode(word);
      if (current_node) {
        return current_node.isWord;
      }
      return false;
    }

    /* Get a list of words that start with the same prefix, limit to count number. */
    that.getWords = function (word, count) {
      // Function that populates the words array with the word if it starts with the same prefix and doesnt exceed count.
      function fork(node, word) {
        // Recursively call fork function on the children of given node to find complete words with the prefix.
        function child(character) {
          return fork(node.children[character], word + character);
        }

        // If the word is complete (the node is the last node in the word), 
        // push the word to the list of words to be returned
        node.isWord && words.push(word);

        // Checks to make sure that the number of words returned are less than the count specified. If this is true, then gets the children. 
        // Gets the keys from the node.children object and .some method checks if any of the children of the node satisfy the child() function.
        return words.length >= count || Object.keys(node.children).some(child);
      }
      
      // List of words to return,
      var words = [],
      current_node = that.getNode(word);

      if (current_node) {
        fork(current_node, word);
        return words;
      }
    }
    return that;
}


// Instantiate a new trie
var trie = new Trie();

var tagsDict = {
  "NEW": "New", 
  "THAI": "Thai", 
  "TRENDING": "Trending", 
  "CLOSE": "Close", 
  "INDIAN": "Indian", 
  "BLACKOWNED": "Black-owned", 
  "BAKERY": "Bakery", 
  "CHINESE": "Chinese", 
  "ASIAN": "Asian"
};

/* Iterate over keys in hashmap and add to trie. */
const keys = Object.keys(tagsDict);
for (var i = 0; i < keys.length; i++) {
  trie.insertWord(keys[i]);
}