const esprima = require("esprima");
const escodegen = require("escodegen");
const options = {tokens:true, tolerant: true, loc: true, range: true };
const fs = require("fs");
const chalk = require('chalk');
const { PassThrough } = require("stream");
const { Console } = require("console");

let operations = [ ConditionalBoundary, IncrementalMutations, 
    NegateConditionals, MutateControlFlow, 
    ConditionalExpressionMutation, CloneMutations, 
    NonEmptyStringMutations, ConstantReplaceMutations ];

function rewrite( filepath, newPath) {

    var buf = fs.readFileSync(filepath, "utf8");
    var ast = esprima.parse(buf, options); 

    var operationSelector = getRandomInt(operations.length);
    let op = operations[operationSelector];
    
    console.log(chalk.blueBright(op.name));
    op(ast);
    let code = escodegen.generate(ast);
    fs.writeFileSync( newPath, code);
}


function ConditionalBoundary(ast){
    var conditions = {0:[">",">="],1:["<","<="]};
    var randomCondition = getRandomInt(Object.keys(conditions).length);
    ExpressionMutations(ast,"BinaryExpression",conditions[randomCondition][0],conditions[randomCondition][1]);
}


function IncrementalMutations(ast){
    let candidates = 0;
    traverseWithParents(ast, (node) => {
        if( node.type === "UpdateExpression" && node.operator === "++") {
            candidates++;
        }
    })

    let mutateTarget = getRandomInt(candidates);
    let current = 0;
    traverseWithParents(ast, (node) => {
        //console.log(chalk.blue(node.type))
        if( node.type === "UpdateExpression"  && node.operator === "++" ) {
            if( current === mutateTarget ) {
                if (node.prefix==true) {
                    node.prefix = false;
                    console.log( chalk.magenta(`Replacing ++j with j++ on line ${node.loc.start.line}` ));
            
                }
                else {
                    node.operator = "--";
                    console.log( chalk.magenta(`Replacing i++ with i-- on line ${node.loc.start.line}` ));
                }
            }
            current++;
        }
    })

}


function NegateConditionals(ast){
    var conditions = {0:["==","!="],1:[">","<"]};
    var randomCondition = getRandomInt(Object.keys(conditions).length);
    ExpressionMutations(ast,"BinaryExpression",conditions[randomCondition][0],conditions[randomCondition][1]);
}


function MutateControlFlow(ast){
    let candidates = 0;
    traverseWithParents(ast, (node) => {
        if (node.body)
        {
            if(Array.isArray(node.body.body)){
                var i;
                for (i in node.body.body){
                    iNext=parseInt(i)+1;
                    if (node.body.body[i].type === "IfStatement" )
                    {
                        var newChild=node.body.body[i];
                        if (node.body.body[iNext] && node.body.body[iNext].type === "IfStatement"){
                            while(newChild){
                                if(newChild.alternate){
                                    newChild=newChild.alternate;
                                }
                                else{
                                    break
                                }
                            }
                        if (newChild.alternate == null){
                            candidates++;
                        }                          
                        }
                    }
                }            
            }
        }
        
    })
    
    var mutateTarget = getRandomInt(candidates);
    current=0
    traverseWithParents(ast, (node) => {
        if (node.body)
        {
            if(Array.isArray(node.body.body)){
                var i;
                for (i in node.body.body){
                    iNext=parseInt(i)+1
                    if (node.body.body[i].type === "IfStatement" )
                    {
                        var newChild=node.body.body[i];
                        if (node.body.body[iNext] && node.body.body[iNext].type === "IfStatement"){
                            while(newChild){
                                if(newChild.alternate){
                                    newChild=newChild.alternate;
                                }
                                else{
                                    break
                                }
                            }
                            if (newChild.alternate == null)
                            {
                                if (current == mutateTarget){
                                    newChild.alternate = node.body.body[iNext];
                                    node.body.body.splice(iNext,1);
                                    console.log( chalk.magenta(`Replacing 'if' with 'else if' on line ${newChild.alternate.loc.start.line}`));
                                }
                                current++;
                        
                            }
                        }
                    }             
                }
            }
        }
    })
    
}


function ConditionalExpressionMutation(ast){
    var conditions = {0:["&&","||"],1:["||","&&"]};
    var randomCondition = getRandomInt(Object.keys(conditions).length);
    ExpressionMutations(ast,"LogicalExpression",conditions[randomCondition][0],conditions[randomCondition][1]);
}


function CloneMutations(ast){
    let candidates = [];
    traverseWithParents(ast, (node) => {
        if(node.type === "FunctionDeclaration"){
            funcStart = node.loc.start.line;
            lineStart = -1;
            for (n in node.body.body){
                if (node.body.body[n].type === "VariableDeclaration"){ 
                    for (i in node.body.body[n].declarations){
                        if (node.body.body[n].declarations[i].id.name === "embeddedHtml"){
                            lineStart = node.body.body[n].declarations[i].id.loc.start.line;
                            }
                    }
                }
                if (node.body.body[n].type === "ReturnStatement" && node.body.body[n].argument.name === "embeddedHtml"){
                    return_line = node.body.body[n].loc.start.line;
                    return_body = node.body.body[n];
                    if (lineStart == -1){
                        candidates.push([funcStart,return_line,funcStart]);
                    }
                    else{
                        candidates.push([lineStart,return_line,funcStart]);
                    }
                }
            }
        }
    })

    let mutateTarget = getRandomInt(candidates.length);
    traverseWithParents(ast, (node) => {
        if(node.type === "FunctionDeclaration" && node.loc.start.line == candidates[mutateTarget][2]){
            randomCondition = getRandomInt(node.body.body.length);
            if (node.body.body[randomCondition].loc.start.line<=candidates[mutateTarget][0]){
                randomCondition++;
            }
            insertPosition = node.body.body[randomCondition].loc.start.line;
            node.body.body.splice(randomCondition,0,return_body);
            console.log(chalk.magenta("Inserting return at line",insertPosition));
            return
        }
    })

}


function NonEmptyStringMutations(ast){
    let candidates = 0;
    traverseWithParents(ast, (node) => {
        if( node.value === "") {
            candidates++;
        }
    })

    let mutateTarget = getRandomInt(candidates);
    let current = 0;
    traverseWithParents(ast, (node) => {
        if( node.value === "" ) {
            if( current === mutateTarget ) { 
                node.value = "<div>Bug</div>";
                node.raw="\"<div>Bug</div>\"";
                console.log( chalk.magenta(`Replacing EmptyString with <div>Bug</div> on line ${node.loc.start.line}` ));
            }
            current++;
        }
    })

}


function ConstantReplaceMutations(ast){
    let candidates = 0;
    traverseWithParents(ast, (node) => {
        if( node.value === 0 ) {
            candidates++;
        }
    })

    let mutateTarget = getRandomInt(candidates);
    let current = 0;
    traverseWithParents(ast, (node) => {
        if( node.value === 0 ) {
            if( current === mutateTarget ) {
                node.value = 3
                console.log( chalk.magenta(`Replacin 0 with 3 on line ${node.loc.start.line}` ));
            }
            current++;
        }
    })
}


function ExpressionMutations(ast,operation,oldOpr,newOpr) {

    let candidates = 0;
    traverseWithParents(ast, (node) => {
        if( node.type === operation && node.operator === oldOpr ) {
            candidates++;
        }
    })

    let mutateTarget = getRandomInt(candidates);
    let current = 0;
    traverseWithParents(ast, (node) => {
        if( node.type === operation && node.operator === oldOpr ) {
            if( current === mutateTarget ) {
                node.operator = newOpr;
                console.log( chalk.magenta(`Replacing ${oldOpr} with ${newOpr} on line ${node.loc.start.line}` ));
            }
            current++;
        }
    })

}



rewrite("/home/ubuntu/checkbox.io-micro-preview/marqdown.js", 
"/home/ubuntu/checkbox.io-micro-preview/marqdown-mod.js")




function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


// A function following the Visitor pattern.
// Annotates nodes with parent objects.
function traverseWithParents(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverseWithParents(child, visitor);
            }
        }
    }
}


// Helper function for counting children of node.
function childrenLength(node)
{
	var key, child;
	var count = 0;
	for (key in node) 
	{
		if (node.hasOwnProperty(key)) 
		{
			child = node[key];
			if (typeof child === 'object' && child !== null && key != 'parent') 
			{
				count++;
			}
		}
	}	
	return count;
}


// Helper function for checking if a node is a "decision type node"
function isDecision(node)
{
	if( node.type == 'IfStatement' || node.type == 'ForStatement' || node.type == 'WhileStatement' ||
		 node.type == 'ForInStatement' || node.type == 'DoWhileStatement')
	{
		return true;
	}
	return false;
}

// Helper function for printing out function name.
function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "anon function @" + node.loc.start.line;
}
