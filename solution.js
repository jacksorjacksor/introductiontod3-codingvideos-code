const fs = require('fs');

// HELPER FUNCTIONS

// --------- Ex6 helper ------------- //

function create_dataframe(filename)
// Reads a CSV file into an array of arrays. Each array contains a row.
{
    let df = fs.readFileSync(filename, 'utf8');
    df = df.split('\n');
    if (df[df.length-1]=='')
        df.splice(df.length-1, 1);   // Removes trailing empty string in example tables.
    if (isNaN(Number.parseInt(df[0])))    // Check if first row is a header.
        df.splice(0,1);
    for (let i = 0; i<df.length; ++i)
        df[i] = df[i].split(','); // Split row
    return df;
}

// --------- Ex7 helper ------------- //

function find_relative_closing_index(subarray)
/* Outputs the correct closing bracket for the opening bracket
   at the first index of a string representation of a list. */
{
    let openers = -1;
    for (let i=0; i<subarray.length; ++i)
    {
        if (subarray[i] === '[')
            ++openers;
        if (subarray[i] === ']')
        {
            if (openers > 0)
                --openers;
            else
                return i;
        }
    }
}

// --------- Ex8 helper ------------- //

function spacemon_battle(r1_spacemon, r2_spacemon)
// Spacemen from each roster fight, the winning roster and surviving spacemon is returned.
{
    multiplier_table = {                                 
        'Mercury':{'Mercury':1., 'Venus':2., 'Earth':1., 'Mars':0.5},
        'Venus':{'Mercury':0.5, 'Venus':1., 'Earth':2., 'Mars':1.},
        'Earth':{'Mercury':1., 'Venus':0.5, 'Earth':1., 'Mars':2.},
        'Mars':{'Mercury':2., 'Venus':1., 'Earth':0.5, 'Mars':1.}}
    
    const multiplier = multiplier_table[r1_spacemon[0]][r2_spacemon[0]];
	// Battle loop
    while (r1_spacemon[1] > 0 && r2_spacemon[1] > 0)
    {
		// Spacemon 1 attacks Spacemon 2
        r2_spacemon[1] -= r1_spacemon[2] * multiplier;
        if (r2_spacemon[1] <= 0)
            return {'winner':1, 'survivor':r1_spacemon};
		// Spacemon 2 attacks Spacemon 1
        r1_spacemon[1] -= r2_spacemon[2] / multiplier;
    }
    return {'winner':2, 'survivor':r2_spacemon};
}


// --------- Ex10 helpers ------------- //

function find_node_neighbours(network, nodes)
// Creates an object containing all neighbouring nodes of each node in a network.
{
    const node_neighbours = {};
    for (let i = 0; i<nodes.length; ++i)
    {
        node_neighbours[nodes[i]] = [];
		// Find neighbours of node i
        for (let ii = 0; ii<nodes.length; ++ii)
        {
            if (network[i][ii] === 1)
                node_neighbours[nodes[i]].push(nodes[ii]);
        }
    }
    return node_neighbours;
}

function find_maximal_cliques(node_neighbours, remaining_nodes=[], potential_clique=[], skip_nodes=[])
/* Implementation of the bron-kerbosch algorithm.
   For each potental clique in the network, it checks whether it is a maximal clique. Returns comma separated maximal cliques as a string.
   
   A portion of this function is adapted from an implementation of the bron-kerbosch algorithm by S. Vishwas.
   Accessed 17/11/21
   https://iq.opengenus.org/bron-kerbosch-algorithm/
*/
{   
    if (remaining_nodes.length == 0 && skip_nodes.length == 0)
        return potential_clique.join("") + ",";
    let maximal_cliques = "";
    
	// Loop on non-visited (remaining) nodes
    while (remaining_nodes.length > 0)
    {
        const node = remaining_nodes[0];
		// Try adding node to clique
        const new_potential_clique = potential_clique.concat([node]);
        const new_remaining_nodes = [];
		// Update cliques' neighbourhood
        for (let remain_node of remaining_nodes)
        {
            if (node_neighbours[node].includes(remain_node))
                new_remaining_nodes.push(remain_node);
        }
        const new_skip_nodes = [];
        for (let skip_node of skip_nodes)
        {
            if (node_neighbours[node].includes(skip_node))
                new_skip_nodes.push(skip_node);
        }
		// Recursive call to extend current clique
        maximal_cliques = maximal_cliques 
                        + find_maximal_cliques(node_neighbours, new_remaining_nodes, new_potential_clique, new_skip_nodes);
        
        remaining_nodes.shift();
        skip_nodes.push(node);
    }
    return maximal_cliques;
}

function count(array, search_value)
// Returns the number of times 'search_value' appears in 'array'.
{
    let counter = 0;
    for (value of array)
        if (value === search_value) {++counter;}
    return counter;
}

// ------------------------- //

module.exports = {

    // Exercise 1
    freefall: (val, isD) =>
    /* Returns the distance (meters) an object has fallen or the time (sseconds) to fall.
       isD boolean specifies whether the input value is a distance or time. */
    {
        const gravity=9.81; // Gravity constant
		// Computing result
        let result = (isD ? Math.sqrt(2*val/gravity) : 0.5*gravity*val**2);
        result = Math.round(result * 100) / 100;    // Rounds to two decimal places.
        return result.toString();
    },

    // Exercise 2
    RPS: (play) =>
    /* Returns a string which would win against the input string for each game of Rock-Paper-Scissors.
       Adapted from a Stack Overflow post by J. Lonowski 23-05-2012
       Accessed 10/11/21
       https://stackoverflow.com/questions/10726638/how-do-you-map-replace-characters-in-javascript-similar-to-the-tr-function-in */
    {
		// Replacing with winning move
        return play.replace(/[RPS]/g, function (l) {return {'R':'P', 'P':'S', 'S':'R'}[l];});
    },

    // Exercise 3
    list2str: (l) =>
    // Returns a string representation of the input list without commas or quotations denoting strings.
    {
        let output = "";
        for (item of l)
			// Recursive step
            output += (Array.isArray(item) ? module.exports.list2str(item) : item);  
        return "[" + output + "]";
    },

    // Exercise 4
    textPreprocessing: (text) =>
    // Returns a list of lowercase words with some punctuation, 'stopwords' and suffixes removed.
    {
        const re_punc = /[\.\?\!\,\:\;\-\[\]\{\}\(\)\'\"]/g;
        const re_suffix = /(ed\s)|(ing\s)|(s\s)/g;
        const stopwords = ['i','a','about','am','an','are','as','at','be','by','for','from','how',
        'in','is','it','of','on','or','that','the','this','to','was','what','when',
        'where','who','will','with']

        for (let i=0; i<text.length; ++i)
            text = text.replace(re_punc, '');
        text = text.toLowerCase(); // Lower casing
        text = text.split(' ') // Tokenization
		// Stopwords removal
        text = text.filter(word => !stopwords.includes(word) && word != '');
		// Suffix removal
        for (let i=0; i<text.length; ++i) 
            text[i] = (text[i] + ' ').replace(re_suffix, '').replace(' ', '');
        return text;
    },

    // Exercise 5
    isGreaterThan: (dict1, dict2) => 
    /* Checks three conditions:
       - dict1 contains all the keys in dict2.
       - dict1 has values equal to or greater than dict2.
       - at least one of dict1's value is greater than dict2's values. */
    {
        let has_greater_value = false;
        for (key of Object.keys(dict2))
        {
			// - dict1 contains all the keys in dict2.
			// - dict1 has values equal to or greater than dict2.
            if (!Object.keys(dict1).includes(key) || dict2[key] > dict1[key])
                return false;
			// - at least one of dict1's value is greater than dict2's values.
            if (dict2[key] < dict1[key])
                has_greater_value = true;
        }
        return has_greater_value;
    },

    // Exercise 6
    CSVsum: (filename) =>
    // Returns an Array containing the sum of each column of a CSV file.
    {
		// Convert CSV file to data frame
        const df = create_dataframe(filename);
        if (!df.length)
            return [];
		// Compute sum of columns
        const column_sums = [];
        for (let col = 0; col<df[0].length; ++col)
        {
            const column = [];
            for (let row = 0; row<df.length; ++row)
                column.push(Number.parseFloat(df[row][col]));
            column_sums.push(column.reduce((total, value) => {return total + value;}, 0));   
        }  
        return column_sums
    },

    // Exercise 7
    str2list: (s) =>
    /* Converts a string representation of an array to an array.
       Pre-condition: string must follow the format '[a[bc]]'. */ 
    {
        if (!Array.isArray(s))
            s = s.split('');
        const contents = s;
        contents.pop();
        contents.shift();    // Remove the outermost '[' and ']'.
        let i = 0;
        let length = contents.length;
        while (i < length)
        {
			// Check if a new list begins
            if (contents[i] === '[')
            {
				// Process sublist
                let closing_index = i + find_relative_closing_index(contents.slice(i, contents.length));
                contents[i] = module.exports.str2list(contents.slice(i, closing_index+1));
				// Remove processed sublist
                contents.splice(i+1, (closing_index-i));
                length = contents.length
            }
            ++i;
        }
        return contents;
    },
    
    // Exercise 8
    spacemonSim: (roster1, roster2) =>
    // Fights each spacemon in two input rosters. Returns true if roster1 wins.
    {
		// Fight until last one stands
        while (roster1.length > 0 && roster2.length > 0)
        {
			// Simulate battle
            let result = spacemon_battle(roster1[0], roster2[0]);
			// Advance to next opponent
            if (result['winner'] === 1)
            {
                roster1[0] = result.survivor;
                roster2.shift();
            }
            else
            {
                roster2[0] = result.survivor;
                roster1.shift();
            }
        }
        return roster2.length === 0;
    },

    // Exercise 9
    rewardShortPath: (env) => {
		// Finds all the shortest paths, returns the length and highest reward.
		
        let paths = [];
        let lengths = [];
        let rewards = [];

        let posA = findCell(env, 'A');// Locate cell A
        let posB = findCell(env, 'B');// Locate cell B

		// Compute all the paths from A to B
        findAllPaths(env, posA, posB);

        let minLength = lengths.slice().sort((a, b) => a - b)[0]; // Minimum path length
		// Calculate the maximum reward among the shortert paths
        let maxReward = rewards.filter((a, i) => lengths[i] === minLength).sort((a, b) => b - a)[0];

        return [minLength, maxReward];

        function findAllNeighbours(env, pos) {
			// Finds all the neighbours of a given cell in an environment
            let l = [];
            let delta = [[-1, 0], [0,1], [1,0], [0,-1]];
			// Test all possible neighbours
            for(let k = 0; k < delta.length; k++) {
                let tmp = [pos[0]+delta[k][0], pos[1]+delta[k][1]];
				// Verify that the neighbour is feasible
                if(tmp[0] < 0 || tmp[0] >= env.length || tmp[1] < 0 || tmp[1] >= env[0].length || env[tmp[0]][tmp[1]] === 'X') {
                    continue;
                } else {
                    l.push(tmp);
                }
            }
            return l;
        }

        function findAllPaths(env, A, B) {
			// Recursive process starter
            recFindAllPaths(env, A, B, [A], 0);
            return undefined;
        }

        function recFindAllPaths(env, hatA, B, path, reward) {
			//Recursive function that generates all paths going from A to B
			//Find neighbours of current node hatA
            let neigh = findAllNeighbours(env, hatA);
			//Loop on every neighbour n
            for(let i = 0; i < neigh.length; i++) {
                let n = neigh[i];
				//Check that n does not belong to the path 
                if(!(path.find((a) => a.every((ai, j) => ai === n[j])))) {
					//Add n to the path
                    newPath = path.concat([n]);
                    newReward = reward;
					//Check if n is B
                    if(n.every((ni, j) => B[j] === ni)) {
						//Store the path
                        paths.push(newPath);
                        lengths.push(newPath.length-1);
                        rewards.push(reward);
                        continue;
                    }
					//Update reward
                    if(env[n[0]][n[1]] === 'R') {
                        newReward += 1;
                    }
					//Recursive call on current path starting in n
                    recFindAllPaths(env, n, B, newPath, newReward);
                }
            }
            return undefined;
        }

        function findCell(env, c) {
			//Finds a specific cell in env
            for(let i = 0; i < env.length; i++) {
                for(let j = 0; j < env[i].length; j++) {
                    if(env[i][j] === c) {
                        return [i, j];
                    }
                }
            }
            return undefined;
        }

    },

    // Exercise 10
    cliqueCounter: (network) =>
    /* Returns the number of maximal cliques each node in a network belongs to.
       'nodes' is populated using a method taken from MDN Web Docs
       Accessed 17/11/21
       https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from */
    {
        const nodes = Array.from({length: network[0].length}, (v, i) => i.toString());
		// Get list of neighbours
        const node_neighbours = find_node_neighbours(network, nodes);
		// Get maximal cliques
        maximal_cliques = find_maximal_cliques(node_neighbours, nodes.slice(0));
		// Count maximal cliques per node
        const cliques_per_node = [];
        for (let i = 0; i<nodes.length; ++i)
            cliques_per_node.push(count(maximal_cliques.split(""), nodes[i]));
        return cliques_per_node;
    }
}
