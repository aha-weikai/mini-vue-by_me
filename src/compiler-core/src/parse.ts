import { NodeTypes } from "./ast";

const enum TagType {
  Start,
  End,
}

export function baseParse(content: string) {
  const context = createParseContext(content);

  return createRoot(parseChildren(context, []));
}

function parseChildren(context, ancestor) {
  const nodes: any = [];

  while (!isEnd(context, ancestor)) {
    let node;
    let s = context.source;
    if (s.startsWith("{{")) {
      node = parseInterpolation(context);
    } else if (s[0] === "<") {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestor);
      }
    }

    if (!node) {
      node = parseText(context);
    }
    nodes.push(node);
  }
  return nodes;
}

function isEnd(context, ancestor) {
  // 当遇到结束标签的时候
  const s = context.source;
  if (s.startsWith("</")) {
    for (let i = ancestor.length - 1; i >= 0; i--) {
      const tag = ancestor[i];
      if (startsWithTagOpen(s, tag)) {
        return true;
      }
    }
  }
  // source 有值
  return !context.source;
}

function parseText(context) {
  let endIndex = context.source.length;
  const endToken = ["<", "{{"];

  for (const token of endToken) {
    const index = context.source.indexOf(token);
    if (index !== -1 && endIndex > index) {
      endIndex = index;
    }
  }

  const index = context.source.indexOf(endToken);
  if (index !== -1) {
    endIndex = index;
  }
  const content = parseTextData(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function parseTextData(context, length) {
  const content = context.source.slice(0, length);

  advanceBy(context, length);
  return content;
}

function parseElement(context, ancestor) {
  // 解析tag
  const element: any = parseTag(context, TagType.Start);
  ancestor.push(element.tag);
  element.children = parseChildren(context, ancestor);
  ancestor.pop();

  if (startsWithTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End);
  } else {
    throw new Error(`缺少结束标签:${element.tag}`);
  }

  return element;
}

function startsWithTagOpen(source, tag) {
  return source.startsWith("</") && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase();
}

function parseTag(context: any, type: TagType) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  console.log(match);
  const tag = match[1];

  // 推荐字节流
  advanceBy(context, match[0].length);
  advanceBy(context, 1);

  if (type === TagType.End) return;

  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
}

// Interpolation : 插值
function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const closeIndex = context.source.indexOf("}}", openDelimiter.length);
  advanceBy(context, openDelimiter.length);

  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = parseTextData(context, rawContentLength);
  const content = rawContent.trim();
  advanceBy(context, closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  };
}

function advanceBy(context, length: number) {
  context.source = context.source.slice(length);
}

function createParseContext(content: string) {
  return {
    source: content,
  };
}

function createRoot(children) {
  return { children, type: NodeTypes.ROOT };
}
