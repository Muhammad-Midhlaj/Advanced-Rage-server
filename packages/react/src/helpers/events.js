const __events = new Map();

const listenEvent = (eventName, eventFunction) => {
    if (__events.has(eventName)) {
        const event = __events.get(eventName);

        if (!event.has(eventFunction)) {
            event.add(eventFunction);
        }
    } else {
        __events.set(eventName, new Set([eventFunction]));
    }
};

const callEvent = (eventName, ...args) => {
    if (__events.has(eventName)) {
        const event = __events.get(eventName);

        event.forEach(eventFunction => {
            eventFunction(...args);
        });
    }
};

const removeEvent = (eventName, eventFunction) => {
    if (__events.has(eventName)) {
        const event = __events.get(eventName);

        if (!event.has(eventFunction)) {
            event.delete(eventFunction);
        }
    }
};

export default {
    on: listenEvent,
    call: callEvent,
    remove: removeEvent
};