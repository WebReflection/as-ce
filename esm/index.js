export default (selectors, root) => {
  const wm = new WeakMap;

  const attributeChanged = records => {
    for (let i = 0, {length} = records; i < length; i++) {
      const {target, attributeName, oldValue} = records[i];
      const newValue = target.getAttribute(attributeName);
      wm.get(target).a[attributeName].forEach(attributeChangedCallback => {
        attributeChangedCallback.call(target, attributeName, oldValue, newValue);
      });
    }
  };

  const invoke = (nodes, key, parsed, noCheck) => {
    for (let i = 0, {length} = nodes; i < length; i++) {
      const target = nodes[i];
      if (!parsed.has(target) && (noCheck || ('querySelectorAll' in target))) {
        parsed.add(target);
        if (wm.has(target))
          wm.get(target)[key].forEach(call, target);
        if (selectors.length)
          invoke(target.querySelectorAll(selectors), key, parsed, true);
      }
    }
  };

  const mainLoop = records => {
    for (let i = 0, {length} = records; i < length; i++) {
      const {addedNodes, removedNodes} = records[i];
      invoke(addedNodes, 'c', new Set, false);
      attributeChanged(sao.takeRecords());
      invoke(removedNodes, 'd', new Set, false);
    }
  };

  const set = target => {
    const sets = {a: {}, c: new Set, d: new Set};
    wm.set(target, sets);
    return sets;
  };

  const sao = new MutationObserver(attributeChanged);
  const sdo = new MutationObserver(mainLoop);
  sdo.observe(root || document, {childList: true, subtree: true});

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
    const {a, c, d} = wm.get(target) || set(target);
    if (observedAttributes) {
      sao.observe(target, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: observedAttributes
      });
      observedAttributes.forEach(attributeName => {
        (a[attributeName] || (a[attributeName] = new Set))
          .add(attributeChangedCallback);
        if (target.hasAttribute(attributeName))
          attributeChangedCallback.call(
            target,
            attributeName,
            null,
            target.getAttribute(attributeName)
          );
      });
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
