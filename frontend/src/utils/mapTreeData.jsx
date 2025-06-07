export const mapTreeData = (menuData) => {
  const uniqueItemsMap = new Map();
  menuData.forEach(item => {
    if (!uniqueItemsMap.has(item.menuId)) {
      uniqueItemsMap.set(item.menuId, item);
    }
  });
  const uniqueItems = Array.from(uniqueItemsMap.values());

  uniqueItems.forEach(item => {
    if (item.parentId === 0) item.parentId = null;
  });

  const buildTree = (items, parentId = null) => {
    return items
      .filter(item => item.parentId === parentId)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map(item => ({
        ...item,
        id: item.menuId,
        parent: parentId ?? 0,
        text: item.menuName,
        droppable: true,
        children: buildTree(items, item.menuId),
      }));
  };

  const flattenTree = (nodes, parentId = 0) => {
    return nodes.flatMap((node, index) => {
      const { children, ...rest } = node;
      return [
        {
          ...rest,
          parent: parentId,
          position: index + 1,
        },
        ...flattenTree(children || [], node.menuId),
      ];
    });
  };

  const nestedTree = buildTree(uniqueItems);
  return flattenTree(nestedTree);
};