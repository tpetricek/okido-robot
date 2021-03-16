import { Union, toString } from "./.fable/fable-library.3.1.1/Types.js";
import { insert, substring } from "./.fable/fable-library.3.1.1/String.js";
import { createObj, comparePrimitives, min } from "./.fable/fable-library.3.1.1/Util.js";
import { append, forAll, getEnumerator, rangeNumber, map, delay } from "./.fable/fable-library.3.1.1/Seq.js";
import { array_type, tuple_type, union_type, obj_type, string_type, lambda_type, unit_type, class_type } from "./.fable/fable-library.3.1.1/Reflection.js";
import { concat, append as append_1, singleton, cons, empty } from "./.fable/fable-library.3.1.1/List.js";
import { getItemFromDict } from "./.fable/fable-library.3.1.1/MapUtil.js";
import { patch, diff, h as h_1 } from "virtual-dom";
import { map as map_1, unzip } from "./.fable/fable-library.3.1.1/Array.js";
import Event$ from "./.fable/fable-library.3.1.1/Event.js";
import { some, value as value_1 } from "./.fable/fable-library.3.1.1/Option.js";
import { add } from "./.fable/fable-library.3.1.1/Observable.js";

export function Common_niceNumber(num, decs) {
    const str = toString(num);
    const dot = str.indexOf(".") | 0;
    const patternInput = (dot === -1) ? [str, ""] : [substring(str, 0, dot), substring(str, dot + 1, min(comparePrimitives, decs, (str.length - dot) - 1))];
    const before = patternInput[0];
    const after = patternInput[1];
    const after_1 = (after.length < decs) ? (after + (Array.from(delay(() => map((i) => "0", rangeNumber(1, 1, decs - after.length)))).join(''))) : after;
    let res = before;
    if (before.length > 5) {
        const enumerator = getEnumerator(rangeNumber(before.length - 1, -1, 0));
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                const i_1 = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]() | 0;
                const j = (before.length - i_1) | 0;
                if ((i_1 !== 0) ? ((j % 3) === 0) : false) {
                    res = insert(res, i_1, ",");
                }
            }
        }
        finally {
            enumerator.Dispose();
        }
    }
    if (forAll((y_1) => ("0" === y_1), after_1.split(""))) {
        return res;
    }
    else {
        return (res + ".") + after_1;
    }
}

export class DomAttribute extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Event", "Attribute", "Property"];
    }
}

export function DomAttribute$reflection() {
    return union_type("App.Html.DomAttribute", [], DomAttribute, () => [[["Item", lambda_type(class_type("Browser.Types.HTMLElement"), lambda_type(class_type("Browser.Types.Event"), unit_type))]], [["Item", string_type]], [["Item", obj_type]]]);
}

export class DomNode extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Text", "Element"];
    }
}

export function DomNode$reflection() {
    return union_type("App.Html.DomNode", [], DomNode, () => [[["Item", string_type]], [["ns", string_type], ["tag", string_type], ["attributes", array_type(tuple_type(string_type, DomAttribute$reflection()))], ["children", array_type(DomNode$reflection())]]]);
}

export function createTree(ns, tag, args, children) {
    const attrs = [];
    const props = [];
    let postf = empty();
    const enumerator = getEnumerator(args);
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const forLoopVar = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
            const v = forLoopVar[1];
            const k = forLoopVar[0];
            const matchValue = [k, v];
            if (matchValue[1].tag === 2) {
                const o = matchValue[1].fields[0];
                const k_2 = matchValue[0];
                void (props.push([k_2, o]));
            }
            else if (matchValue[1].tag === 0) {
                const k_3 = matchValue[0];
                const f = matchValue[1].fields[0];
                let id;
                const matchValue_1 = getItemFromDict(new Map(args), "id");
                if (matchValue_1.tag === 1) {
                    const v_2 = matchValue_1.fields[0];
                    id = v_2;
                }
                else {
                    throw (new Error("No ID"));
                }
                postf = cons(() => {
                    const el = document.getElementById(id);
                    if ((el.dataset[("has" + k_3)]) !== "yay") {
                        el.dataset[("has" + k_3)]="yay";
                        el.addEventListener(k_3, (o_1) => {
                            f(o_1["target"], event);
                        });
                    }
                }, postf);
            }
            else {
                const v_1 = matchValue[1].fields[0];
                const k_1 = matchValue[0];
                void (attrs.push([k_1, v_1]));
            }
        }
    }
    finally {
        enumerator.Dispose();
    }
    const attrs_1 = createObj(attrs);
    const ns_1 = ((ns === null) ? true : (ns === "")) ? empty() : singleton(["namespace", ns]);
    const props_1 = createObj(append(append_1(ns_1, singleton(["attributes", attrs_1])), props));
    const elem = h_1(tag, props_1, children);
    return [elem, postf];
}

export function renderVirtual(node) {
    if (node.tag === 1) {
        const tag = node.fields[1];
        const ns = node.fields[0];
        const children = node.fields[3];
        const attrs = node.fields[2];
        const patternInput = unzip(map_1(renderVirtual, children));
        const postfs = patternInput[1];
        const children_1 = patternInput[0];
        const patternInput_1 = createTree(ns, tag, attrs, children_1);
        const res = patternInput_1[0];
        const postf = patternInput_1[1];
        return [res, append_1(postf, concat(postfs))];
    }
    else {
        const s_1 = node.fields[0];
        return [s_1, empty()];
    }
}

export function createVirtualDomApp(id, initial, r, u) {
    const event = new Event$();
    const trigger = (e) => {
        event.Trigger(e);
    };
    let container = document.createElement("div");
    document.getElementById(id).innerHTML = "";
    const value = document.getElementById(id).appendChild(container);
    void value;
    let tree = {};
    let state = initial;
    const handleEvent = (evt) => {
        if (evt != null) {
            const e_1 = value_1(evt);
            state = u(state, e_1);
        }
        else {
            state = state;
        }
        const patternInput = renderVirtual(r(trigger, state));
        const postf = patternInput[1];
        const newTree = patternInput[0];
        const patches = diff(tree, newTree);
        container = patch(container, patches);
        const enumerator = getEnumerator(postf);
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                const f = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                f();
            }
        }
        finally {
            enumerator.Dispose();
        }
        tree = newTree;
    };
    handleEvent(void 0);
    add((arg) => {
        handleEvent(some(arg));
    }, event.Publish);
}

export function text(s_1) {
    return new DomNode(0, s_1);
}

export function op_EqualsGreater(k, v) {
    return [k, new DomAttribute(1, v)];
}

export function op_EqualsBangGreater(k, f) {
    return [k, new DomAttribute(0, f)];
}

export class El {
    constructor(ns) {
        this.ns = ns;
    }
}

export function El$reflection() {
    return class_type("App.Html.El", void 0, El);
}

export function El_$ctor_Z721C83C5(ns) {
    return new El(ns);
}

export function El__get_Namespace(x) {
    return x.ns;
}

export function El_op_Dynamic_Z7C20BED5(el, n) {
    return (a) => ((b) => (new DomNode(1, El__get_Namespace(el), n, Array.from(a), Array.from(b))));
}

export const h = El_$ctor_Z721C83C5(null);

export const s = El_$ctor_Z721C83C5("http://www.w3.org/2000/svg");

