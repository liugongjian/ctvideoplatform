export const mapTree = (tree, func) => tree.map((item) => {
  if (item.children && Array.isArray(item.children)) {
    const children = mapTree(item.children, func);
    return {
      ...func(item),
      children,
    };
  }
  return func(item);
});
