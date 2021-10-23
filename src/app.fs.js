import { cons, tryFindIndex, ofSeq, singleton, append, empty, item, length, ofArray } from "./.fable/fable-library.3.1.1/List.js";
import { Record, Union } from "./.fable/fable-library.3.1.1/Types.js";
import { record_type, tuple_type, int32_type, option_type, list_type, union_type, string_type } from "./.fable/fable-library.3.1.1/Reflection.js";
import { int32ToString, equals, equalArrays, randomNext } from "./.fable/fable-library.3.1.1/Util.js";
import { getItemFromDict } from "./.fable/fable-library.3.1.1/MapUtil.js";
import { toText, printf, toConsole } from "./.fable/fable-library.3.1.1/String.js";
import { createVirtualDomApp, op_EqualsBangGreater, op_EqualsGreater, h, El_op_Dynamic_Z7C20BED5 } from "./html.fs.js";
import { rangeNumber, empty as empty_1, map, singleton as singleton_1, append as append_1, delay } from "./.fable/fable-library.3.1.1/Seq.js";

export const sockKey = "s";

export const socks = ofArray([[4, 1], [3, 2], [2, 3], [4, 3], [3, 4], [4, 4], [4, 5], [2, 5], [2, 6], [3, 6]]);

export const robotImg = "robot.gif";

export const arrowPrefix = "";

export class Event$ extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Reset", "Play", "Step", "Code", "Home"];
    }
}

export function Event$$reflection() {
    return union_type("App.Main.Event", [], Event$, () => [[], [], [], [["Item", string_type]], []]);
}

export class State extends Record {
    constructor(Program, Playing, Robot, Objective, Animation) {
        super();
        this.Program = Program;
        this.Playing = Playing;
        this.Robot = Robot;
        this.Objective = (Objective | 0);
        this.Animation = Animation;
    }
}

export function State$reflection() {
    return record_type("App.Main.State", [], State, () => [["Program", list_type(string_type)], ["Playing", option_type(list_type(string_type))], ["Robot", tuple_type(int32_type, int32_type)], ["Objective", int32_type], ["Animation", string_type]]);
}

export const rnd = {};

export function pickSock() {
    return randomNext(0, length(socks));
}

export const diff = new Map([["down", [1, 0]], ["up", [-1, 0]], ["left", [0, -1]], ["right", [0, 1]]]);

export function step(_arg1) {
    if (_arg1.Playing != null) {
        if (_arg1.Playing.tail != null) {
            const c = _arg1.Robot[1] | 0;
            const prog = _arg1.Playing.tail;
            const r = _arg1.Robot[0] | 0;
            const state_1 = _arg1;
            const step_1 = _arg1.Playing.head;
            const patternInput = getItemFromDict(diff, step_1);
            const dr = patternInput[0] | 0;
            const dc = patternInput[1] | 0;
            const patternInput_1 = [r + dr, c + dc];
            const nr = patternInput_1[0] | 0;
            const nc = patternInput_1[1] | 0;
            if (((((nr < 1) ? true : (nr > 4)) ? true : (nc < 1)) ? true : (nc > 6)) ? true : ((nr === 1) ? (nc !== 1) : false)) {
                return new State(state_1.Program, void 0, state_1.Robot, state_1.Objective, "shake");
            }
            else {
                return new State(state_1.Program, prog, [nr, nc], state_1.Objective, state_1.Animation);
            }
        }
        else {
            const state = _arg1;
            const tupledArg = [state.Robot, item(state.Objective, socks)];
            toConsole(printf("%A"))([tupledArg[0], tupledArg[1]]);
            const anim = equalArrays(state.Robot, item(state.Objective, socks)) ? "win" : "shake";
            return new State(state.Program, void 0, state.Robot, state.Objective, anim);
        }
    }
    else {
        const state_2 = _arg1;
        return state_2;
    }
}

export function update(state, _arg1) {
    let pattern_matching_result;
    if (_arg1.tag === 0) {
        pattern_matching_result = 0;
    }
    else if (_arg1.tag === 4) {
        if (state.Animation === "win") {
            pattern_matching_result = 1;
        }
        else {
            pattern_matching_result = 2;
        }
    }
    else {
        pattern_matching_result = 2;
    }
    switch (pattern_matching_result) {
        case 0: {
            return new State(empty(), state.Playing, [1, 1], state.Objective, state.Animation);
        }
        case 1: {
            return new State(empty(), void 0, [1, 1], pickSock(), "");
        }
        case 2: {
            let pattern_matching_result_1;
            if (_arg1.tag === 4) {
                pattern_matching_result_1 = 0;
            }
            else if (_arg1.tag === 3) {
                pattern_matching_result_1 = 1;
            }
            else if (_arg1.tag === 1) {
                if (equals(state.Playing, void 0)) {
                    pattern_matching_result_1 = 2;
                }
                else {
                    pattern_matching_result_1 = 3;
                }
            }
            else {
                pattern_matching_result_1 = 3;
            }
            switch (pattern_matching_result_1) {
                case 0: {
                    return new State(empty(), void 0, [1, 1], state.Objective, "");
                }
                case 1: {
                    const f = _arg1.fields[0];
                    return new State(append(state.Program, singleton(f)), state.Playing, state.Robot, state.Objective, state.Animation);
                }
                case 2: {
                    return step(new State(state.Program, state.Program, state.Robot, state.Objective, state.Animation));
                }
                case 3: {
                    switch (_arg1.tag) {
                        case 1: {
                            return state;
                        }
                        case 2: {
                            return step(state);
                        }
                        default: {
                            throw (new Error("The match cases were incomplete against type of \u0027Event\u0027 at C:/Tomas/Public/tpetricek/okido/src/app.fs"));
                        }
                    }
                }
            }
        }
    }
}

export function render(trigger, state) {
    if (state.Playing != null) {
        const value = window.setTimeout((_arg1) => {
            trigger(new Event$(2));
        }, 1000);
        void value;
    }
    if (state.Animation !== "") {
        const value_1 = window.setTimeout((_arg2) => {
            trigger(new Event$(4));
        }, 3000);
        void value_1;
    }
    return El_op_Dynamic_Z7C20BED5(h, "div")(empty())(ofSeq(delay(() => append_1(singleton_1(El_op_Dynamic_Z7C20BED5(h, "div")(singleton(op_EqualsGreater("class", "r1")))(ofArray([El_op_Dynamic_Z7C20BED5(h, "div")(singleton(op_EqualsGreater("class", "box b1")))(ofSeq(delay(() => {
        const patternInput = state.Robot;
        const r = patternInput[0] | 0;
        const c = patternInput[1] | 0;
        let style;
        const arg20 = ((10 * c) - 10) | 0;
        const arg10 = ((10 * r) - 10) | 0;
        style = toText(printf("top:%dvw; left:%dvw;"))(arg10)(arg20);
        const cls = "robot " + state.Animation;
        return singleton_1(El_op_Dynamic_Z7C20BED5(h, "img")(ofArray([op_EqualsGreater("class", cls), op_EqualsGreater("src", robotImg), op_EqualsGreater("style", style)]))(empty()));
    }))), El_op_Dynamic_Z7C20BED5(h, "div")(singleton(op_EqualsGreater("class", "prog")))(ofSeq(delay(() => append_1(map((p) => El_op_Dynamic_Z7C20BED5(h, "img")(singleton(op_EqualsGreater("src", (arrowPrefix + p) + ".gif")))(empty()), state.Program), delay(() => {
        let arg20_1;
        return singleton_1(El_op_Dynamic_Z7C20BED5(h, "img")(ofArray([op_EqualsGreater("src", (arg20_1 = ((state.Objective + 1) | 0), toText(printf("%s%d.gif"))(sockKey)(arg20_1))), op_EqualsGreater("class", "objective")]))(empty()));
    })))))]))), delay(() => append_1(map((r_1) => El_op_Dynamic_Z7C20BED5(h, "div")(singleton(op_EqualsGreater("class", "r" + int32ToString(r_1))))(ofSeq(delay(() => map((b) => {
        const idx = tryFindIndex((y) => equalArrays([r_1, b], y), socks);
        const cls_1 = (!equals(idx, void 0)) ? "socky" : "";
        return El_op_Dynamic_Z7C20BED5(h, "div")(singleton(op_EqualsGreater("class", (("box b" + int32ToString(b)) + " ") + cls_1)))(ofSeq(delay(() => {
            if (idx != null) {
                const i = idx | 0;
                return singleton_1(El_op_Dynamic_Z7C20BED5(h, "img")(singleton(op_EqualsGreater("src", (sockKey + int32ToString(i + 1)) + ".gif")))(empty()));
            }
            else {
                return empty_1();
            }
        })));
    }, rangeNumber(1, 1, 6))))), rangeNumber(2, 1, 4)), delay(() => {
        const handlers = (e) => {
            let c_1;
            return ofArray([op_EqualsGreater("id", (e.tag === 3) ? (c_1 = e.fields[0], c_1) : "go"), op_EqualsBangGreater("touchstart", (_arg3, je) => {
                je.preventDefault();
                trigger(e);
            }), op_EqualsBangGreater("click", (_arg5, _arg4) => {
                trigger(e);
            })]);
        };
        return singleton_1(El_op_Dynamic_Z7C20BED5(h, "div")(singleton(op_EqualsGreater("class", "controls")))(ofArray([El_op_Dynamic_Z7C20BED5(h, "button")(handlers(new Event$(3, "up")))(singleton(El_op_Dynamic_Z7C20BED5(h, "img")(singleton(op_EqualsGreater("src", arrowPrefix + "up.gif")))(empty()))), El_op_Dynamic_Z7C20BED5(h, "button")(handlers(new Event$(3, "right")))(singleton(El_op_Dynamic_Z7C20BED5(h, "img")(singleton(op_EqualsGreater("src", arrowPrefix + "right.gif")))(empty()))), El_op_Dynamic_Z7C20BED5(h, "button")(handlers(new Event$(3, "down")))(singleton(El_op_Dynamic_Z7C20BED5(h, "img")(singleton(op_EqualsGreater("src", arrowPrefix + "down.gif")))(empty()))), El_op_Dynamic_Z7C20BED5(h, "button")(cons(op_EqualsGreater("class", "mr2"), handlers(new Event$(3, "left"))))(singleton(El_op_Dynamic_Z7C20BED5(h, "img")(singleton(op_EqualsGreater("src", arrowPrefix + "left.gif")))(empty()))), El_op_Dynamic_Z7C20BED5(h, "button")(handlers(new Event$(1)))(singleton(El_op_Dynamic_Z7C20BED5(h, "img")(singleton(op_EqualsGreater("src", arrowPrefix + "go.gif")))(empty())))])));
    })))))));
}

export const init = new State(empty(), void 0, [1, 1], pickSock(), "");

createVirtualDomApp("game", init, render, update);

