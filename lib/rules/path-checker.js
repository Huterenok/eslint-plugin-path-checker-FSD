/* eslint-disable eslint-plugin/require-meta-type */
/* eslint-disable eslint-plugin/prefer-message-ids */
/* eslint-disable no-unused-vars */
/**
 * @fileoverview path-checker
 * @author huterok
 */
"use strict";

const path = require("path");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "path-checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
		return {
			ImportDeclaration(node) {
				const importTo = node.source.value;

				const fromFilename = context.getFilename();

				if(shouldBeRelative(fromFilename, importTo)) {
					// eslint-disable-next-line eslint-plugin/no-deprecated-report-api
					context.report(node, "You should use relative path within the module")
				}
			}
		}
  },
};

function isPathRelative(path) {
	return "." === path || path.startsWith("./") || path.startsWith("../")
}

const layers = {
	"entities": "entities",
	"features": "features",
	"shared": "shared",
	"pages": "pages",
	"widgets": "widgets",
	"processes": "processes"
}

function shouldBeRelative(from, to) {
	if(isPathRelative(to)) {
		return false;
	}

	const toArray = to.split("/");
	const toLayer = toArray[0];
	const toSlice = toArray[1];

	if(!toLayer || !toSlice || !layers[toLayer]) {
		return false;
	}

	const normalizedPath = path.toNamespacedPath(from);
	const projectFrom = normalizedPath.split("src")[1];
	const fromArray = projectFrom.split("\\");

	const fromLayer = fromArray[1];
	const fromSlice = fromArray[2];

	if(!fromLayer || !fromSlice || !layers[fromLayer]) {
		return false;
	}

	return fromSlice === toSlice && fromLayer === toLayer;
}