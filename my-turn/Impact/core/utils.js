export const isEvent = name => name.startsWith("on");
export const isAttribute = name => !isEvent(name) && name !== "children";
