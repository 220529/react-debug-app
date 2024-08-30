const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

function transformJSX(code) {
  // Helper function to transform JSX elements recursively
  function transformJSXElement(node) {
    const openingElement = node.openingElement;
    const tagName = openingElement.name.name;
    const attributes = openingElement.attributes;
    const children = node.children;

    const props = attributes.reduce((acc, attr) => {
      acc[attr.name.name] = attr.value.value;
      return acc;
    }, {});

    const transformedChildren = children.map(child => {
      if (child.type === 'JSXElement') {
        return transformJSXElement(child);
      } else if (child.type === 'JSXText') {
        return {
          type: 'StringLiteral',
          value: child.value,
        };
      }
    }).filter(Boolean);

    return {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'React',
        },
        property: {
          type: 'Identifier',
          name: 'createElement',
        },
      },
      arguments: [
        {
          type: 'StringLiteral',
          value: tagName,
        },
        Object.keys(props).length > 0 ? {
          type: 'ObjectExpression',
          properties: Object.entries(props).map(([key, value]) => ({
            type: 'ObjectProperty',
            key: {
              type: 'Identifier',
              name: key,
            },
            value: {
              type: 'StringLiteral',
              value: value,
            },
          })),
        } : null,
        transformedChildren.length > 0 ? {
          type: 'ArrayExpression',
          elements: transformedChildren,
        } : null,
      ].filter(Boolean),
    };
  }

  // Step 1: 解析源代码，生成 AST
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  // Step 2: 遍历 AST，对 JSX 元素进行转换
  traverse(ast, {
    JSXElement(path) {
      const transformedJSXElement = transformJSXElement(path.node);
      path.replaceWith(transformedJSXElement);
    },
  });

  // Step 3: 生成转换后的代码
  const transformedCode = generator(ast, {}, code).code;
  return transformedCode;
}
// 示例代码包含 JSX
const code = `
  function App() {
    return (
      <div className="container">
      </div>
    );
  }
`;

const transformedCode = transformJSX(code, {});
console.log("transformedCode", transformedCode);
