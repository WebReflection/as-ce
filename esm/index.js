export default (root, upgrade, query) => {
  const wm = new WeakMap;
  const ao = new WeakMap;
  const {filter} = [];

  const attributeChanged = (records, mo) => {
    for (let i = 0, {length} = records; i < length; i++) {
      const {target, attributeName, oldValue} = records[i];
      const newValue = target.getAttribute(attributeName);
      ao.get(mo).call(target, attributeName, oldValue, newValue);
    }
  };

  const elements = target => 'querySelectorAll' in target;

  const mainLoop = records => {
    if (query.length) {
      for (let i = 0, {length} = records; i < length; i++) {
        const {addedNodes, removedNodes} = records[i];
        parse(filter.call(addedNodes, elements), 'c', new Set);
        parse(filter.call(removedNodes, elements), 'd', new Set);
      }
    }
  };

  const parse = (nodes, key, parsed) => {
    for (let i = 0, {length} = nodes; i < length; i++) {
      const target = nodes[i];
      if (!parsed.has(target)) {
        parsed.add(target);
        if (wm.has(target))
          wm.get(target)[key].forEach(call, target);
        else if (key === 'c')
          upgrade(target);
        parse(target.querySelectorAll(query), key, parsed);
      }
    }
  };

  const set = target => {
    const sets = {c: new Set, d: new Set};
    wm.set(target, sets);
    return sets;
  };

  const sdo = new MutationObserver(mainLoop);
  sdo.observe(root, {childList: true, subtree: true});

  return (
    target,
    {
      // connected/disconnected
      connectedCallback,
      disconnectedCallback,
      // attributes to be notified about
      observedAttributes,
      attributeChangedCallback
    }
  ) => {
    mainLoop(sdo.takeRecords());
    const {c, d} = wm.get(target) || set(target);
    if (observedAttributes) {
      const mo = new MutationObserver(attributeChanged);
      mo.observe(target, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: observedAttributes.map(attributeName => {
          if (target.hasAttribute(attributeName))
            attributeChangedCallback.call(
              target,
              attributeName,
              null,
              target.getAttribute(attributeName)
            );
          return attributeName;
        })
      });
      ao.set(mo, attributeChangedCallback);
    }
    if (disconnectedCallback)
      d.add(disconnectedCallback);
    if (connectedCallback) {
      c.add(connectedCallback);
      if (!(
        target.ownerDocument.compareDocumentPosition(target) &
        target.DOCUMENT_POSITION_DISCONNECTED
      ))
        connectedCallback.call(target);
    }
    return target;
  };
};

function call(back) {
  back.call(this);
}
