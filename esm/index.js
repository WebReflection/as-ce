export default (root, upgrade) => {
  const wm = new WeakMap;
  const ao = new WeakMap;

  const attributeChanged = (records, mo) => {
    for (let i = 0, {length} = records; i < length; i++) {
      const {target, attributeName, oldValue} = records[i];
      const newValue = target.getAttribute(attributeName);
      ao.get(mo).call(target, attributeName, oldValue, newValue);
    }
  };

  const invoke = (nodes, key, parsed, isQSA) => {
    for (let i = 0, {length} = nodes; i < length; i++) {
      const target = nodes[i];
      if (!parsed.has(target) && (isQSA || ('querySelectorAll' in target))) {
        parsed.add(target);
        if (wm.has(target))
          wm.get(target)[key].forEach(call, target);
        else if (key === 'c')
          upgrade(target);
        invoke(target.querySelectorAll('*'), key, parsed, true);
      }
    }
  };

  const mainLoop = records => {
    for (let i = 0, {length} = records; i < length; i++) {
      const {addedNodes, removedNodes} = records[i];
      invoke(addedNodes, 'c', new Set, false);
      invoke(removedNodes, 'd', new Set, false);
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
