// Trie implementation
function TrieNode(key) {
  // the "key" value will be the character in sequence
  this.key = key;
  
  // we keep a reference to parent
  this.parent = null;
  
  // we have hash of children
  this.children = {};
  
  // check to see if the node is at the end
  this.end = false;
}

// iterates through the parents to get the word.
// time complexity: O(k), k = word length
TrieNode.prototype.getWord = function() {
  var output = [];
  var node = this;
  
  while (node !== null) {
    output.unshift(node.key);
    node = node.parent;
  }
  
  return output.join('');
};

// -----------------------------------------

// we implement Trie with just a simple root with null value.
function Trie() {
  this.root = new TrieNode(null);
}

// inserts a word into the trie.
// time complexity: O(k), k = word length
Trie.prototype.insert = function(word) {
  var node = this.root; // we start at the root 😬
  
  // for every character in the word
  for(var i = 0; i < word.length; i++) {
    // check to see if character node exists in children.
    if (!node.children[word[i]]) {
      // if it doesn't exist, we then create it.
      node.children[word[i]] = new TrieNode(word[i]);
      
      // we also assign the parent to the child node.
      node.children[word[i]].parent = node;
    }
    
    // proceed to the next depth in the trie.
    node = node.children[word[i]];
    
    // finally, we check to see if it's the last word.
    if (i == word.length-1) {
      // if it is, we set the end flag to true.
      node.end = true;
    }
  }
};

// check if it contains a whole word.
// time complexity: O(k), k = word length
Trie.prototype.contains = function(word) {
  var node = this.root;
  
  // for every character in the word
  for(var i = 0; i < word.length; i++) {
    // check to see if character node exists in children.
    if (node.children[word[i]]) {
      // if it exists, proceed to the next depth of the trie.
      node = node.children[word[i]];
    } else {
      // doesn't exist, return false since it's not a valid word.
      return false;
    }
  }
  
  // we finished going through all the words, but is it a whole word?
  return node.end;
};

// returns every word with given prefix
// time complexity: O(p + n), p = prefix length, n = number of child paths
Trie.prototype.find = function(prefix) {
  var node = this.root;
  var output = [];
  
  // for every character in the prefix
  for(var i = 0; i < prefix.length; i++) {
    // make sure prefix actually has words
    if (node.children[prefix[i]]) {
      node = node.children[prefix[i]];
    } else {
      // there's none. just return it.
      return output;
    }
  }
  
  // recursively find all words in the node
  findAllWords(node, output);
  
  return output;
};

// recursive function to find all words in the given node.
function findAllWords(node, arr) {
  // base case, if node is at a word, push to output
  if (node.end) {
    arr.unshift(node.getWord());
  }
  
  // iterate through each children, call recursive findAllWords
  for (var child in node.children) {
    findAllWords(node.children[child], arr);
  }
}

// -----------------------------------------

// instantiate our trie
var trie = new Trie();

// insert tags
var hardCodedTags = ["NEW", "THAI", "TRENDING", "CLOSE", "INDIAN", "BLACKOWNED", "BAKERY", "CHINESE", "ASIAN"];
for (var i = 0; i < hardCodedTags.length; i++) {
  trie.insert(hardCodedTags[i]);
}

// check contains method
console.log(trie.contains("TRENDING"));  // true
console.log(trie.contains("kickass")); // false

// check find method
console.log(trie.find("ne"));  // [ 'helium', 'hello' ]
console.log(trie.find("NE")); // [ 'hello' ]

/* On key change that is NOT tab or enter */
$('#search-bar').on('keyup', function() {
console.log('This will run each time :)');
});

/* Display an alert containing the inputted address if user presses enter 
  handle tab, enter, and search characters in trie*/
function searchBusiness(keyPress) {
  // If user has typed in characters or numbers.
  if ((keyPress.keyCode >=  A_KEY) && (keyPress.keyCode <= NUMPAD_9_KEY)) {
    filter
  }
  if (keyPress.keyCode === ENTER_KEY) {
      
  }
  return false;
}