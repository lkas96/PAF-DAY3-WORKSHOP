var Df = Object.defineProperty,
  Ef = Object.defineProperties;
var wf = Object.getOwnPropertyDescriptors;
var Ta = Object.getOwnPropertySymbols;
var Cf = Object.prototype.hasOwnProperty,
  _f = Object.prototype.propertyIsEnumerable;
var Sa = (e, t, n) =>
    t in e
      ? Df(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  N = (e, t) => {
    for (var n in (t ||= {})) Cf.call(t, n) && Sa(e, n, t[n]);
    if (Ta) for (var n of Ta(t)) _f.call(t, n) && Sa(e, n, t[n]);
    return e;
  },
  P = (e, t) => Ef(e, wf(t));
var Wt = (e, t, n) =>
  new Promise((r, o) => {
    var i = (c) => {
        try {
          a(n.next(c));
        } catch (u) {
          o(u);
        }
      },
      s = (c) => {
        try {
          a(n.throw(c));
        } catch (u) {
          o(u);
        }
      },
      a = (c) => (c.done ? r(c.value) : Promise.resolve(c.value).then(i, s));
    a((n = n.apply(e, t)).next());
  });
function Oo(e, t) {
  return Object.is(e, t);
}
var H = null,
  Vn = !1,
  Ro = 1,
  de = Symbol("SIGNAL");
function I(e) {
  let t = H;
  return (H = e), t;
}
function Na() {
  return H;
}
var Zt = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Fo(e) {
  if (Vn) throw new Error("");
  if (H === null) return;
  H.consumerOnSignalRead(e);
  let t = H.nextProducerIndex++;
  if ((Un(H), t < H.producerNode.length && H.producerNode[t] !== e && qt(H))) {
    let n = H.producerNode[t];
    Hn(n, H.producerIndexOfThis[t]);
  }
  H.producerNode[t] !== e &&
    ((H.producerNode[t] = e),
    (H.producerIndexOfThis[t] = qt(H) ? Oa(e, H, t) : 0)),
    (H.producerLastReadVersion[t] = e.version);
}
function If() {
  Ro++;
}
function Po(e) {
  if (!(qt(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Ro)) {
    if (!e.producerMustRecompute(e) && !Lo(e)) {
      xo(e);
      return;
    }
    e.producerRecomputeValue(e), xo(e);
  }
}
function Aa(e) {
  if (e.liveConsumerNode === void 0) return;
  let t = Vn;
  Vn = !0;
  try {
    for (let n of e.liveConsumerNode) n.dirty || bf(n);
  } finally {
    Vn = t;
  }
}
function xa() {
  return H?.consumerAllowSignalWrites !== !1;
}
function bf(e) {
  (e.dirty = !0), Aa(e), e.consumerMarkedDirty?.(e);
}
function xo(e) {
  (e.dirty = !1), (e.lastCleanEpoch = Ro);
}
function Bn(e) {
  return e && (e.nextProducerIndex = 0), I(e);
}
function ko(e, t) {
  if (
    (I(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (qt(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Hn(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function Lo(e) {
  Un(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (Po(n), r !== n.version)) return !0;
  }
  return !1;
}
function Vo(e) {
  if ((Un(e), qt(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Hn(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Oa(e, t, n) {
  if ((Ra(e), e.liveConsumerNode.length === 0 && Fa(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      e.producerIndexOfThis[r] = Oa(e.producerNode[r], e, r);
  return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1;
}
function Hn(e, t) {
  if ((Ra(e), e.liveConsumerNode.length === 1 && Fa(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      Hn(e.producerNode[r], e.producerIndexOfThis[r]);
  let n = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t];
    Un(o), (o.producerIndexOfThis[r] = t);
  }
}
function qt(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function Un(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function Ra(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function Fa(e) {
  return e.producerNode !== void 0;
}
function Pa(e) {
  let t = Object.create(Mf);
  t.computation = e;
  let n = () => {
    if ((Po(t), Fo(t), t.value === jn)) throw t.error;
    return t.value;
  };
  return (n[de] = t), n;
}
var No = Symbol("UNSET"),
  Ao = Symbol("COMPUTING"),
  jn = Symbol("ERRORED"),
  Mf = P(N({}, Zt), {
    value: No,
    dirty: !0,
    error: null,
    equal: Oo,
    producerMustRecompute(e) {
      return e.value === No || e.value === Ao;
    },
    producerRecomputeValue(e) {
      if (e.value === Ao) throw new Error("Detected cycle in computations.");
      let t = e.value;
      e.value = Ao;
      let n = Bn(e),
        r;
      try {
        r = e.computation();
      } catch (o) {
        (r = jn), (e.error = o);
      } finally {
        ko(e, n);
      }
      if (t !== No && t !== jn && r !== jn && e.equal(t, r)) {
        e.value = t;
        return;
      }
      (e.value = r), e.version++;
    },
  });
function Tf() {
  throw new Error();
}
var ka = Tf;
function La() {
  ka();
}
function Va(e) {
  ka = e;
}
var Sf = null;
function ja(e) {
  let t = Object.create(Ha);
  t.value = e;
  let n = () => (Fo(t), t.value);
  return (n[de] = t), n;
}
function jo(e, t) {
  xa() || La(), e.equal(e.value, t) || ((e.value = t), Nf(e));
}
function Ba(e, t) {
  xa() || La(), jo(e, t(e.value));
}
var Ha = P(N({}, Zt), { equal: Oo, value: void 0 });
function Nf(e) {
  e.version++, If(), Aa(e), Sf?.();
}
function b(e) {
  return typeof e == "function";
}
function yt(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var $n = yt(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    }
);
function Yt(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var z = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (b(r))
        try {
          r();
        } catch (i) {
          t = i instanceof $n ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Ua(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof $n ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new $n(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Ua(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && Yt(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && Yt(n, t), t instanceof e && t._removeParent(this);
  }
};
z.EMPTY = (() => {
  let e = new z();
  return (e.closed = !0), e;
})();
var Bo = z.EMPTY;
function Gn(e) {
  return (
    e instanceof z ||
    (e && "closed" in e && b(e.remove) && b(e.add) && b(e.unsubscribe))
  );
}
function Ua(e) {
  b(e) ? e() : e.unsubscribe();
}
var fe = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var vt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = vt;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = vt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function zn(e) {
  vt.setTimeout(() => {
    let { onUnhandledError: t } = fe;
    if (t) t(e);
    else throw e;
  });
}
function Ho() {}
var $a = Uo("C", void 0, void 0);
function Ga(e) {
  return Uo("E", void 0, e);
}
function za(e) {
  return Uo("N", e, void 0);
}
function Uo(e, t, n) {
  return { kind: e, value: t, error: n };
}
var rt = null;
function Dt(e) {
  if (fe.useDeprecatedSynchronousErrorHandling) {
    let t = !rt;
    if ((t && (rt = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = rt;
      if (((rt = null), n)) throw r;
    }
  } else e();
}
function Wa(e) {
  fe.useDeprecatedSynchronousErrorHandling &&
    rt &&
    ((rt.errorThrown = !0), (rt.error = e));
}
var ot = class extends z {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Gn(t) && t.add(this))
          : (this.destination = Of);
    }
    static create(t, n, r) {
      return new je(t, n, r);
    }
    next(t) {
      this.isStopped ? Go(za(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? Go(Ga(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? Go($a, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Af = Function.prototype.bind;
function $o(e, t) {
  return Af.call(e, t);
}
var zo = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          Wn(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          Wn(r);
        }
      else Wn(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          Wn(n);
        }
    }
  },
  je = class extends ot {
    constructor(t, n, r) {
      super();
      let o;
      if (b(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && fe.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && $o(t.next, i),
              error: t.error && $o(t.error, i),
              complete: t.complete && $o(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new zo(o);
    }
  };
function Wn(e) {
  fe.useDeprecatedSynchronousErrorHandling ? Wa(e) : zn(e);
}
function xf(e) {
  throw e;
}
function Go(e, t) {
  let { onStoppedNotification: n } = fe;
  n && vt.setTimeout(() => n(e, t));
}
var Of = { closed: !0, next: Ho, error: xf, complete: Ho };
var Et = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function qa(e) {
  return e;
}
function Za(e) {
  return e.length === 0
    ? qa
    : e.length === 1
    ? e[0]
    : function (n) {
        return e.reduce((r, o) => o(r), n);
      };
}
var k = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, o) {
      let i = Ff(n) ? n : new je(n, r, o);
      return (
        Dt(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          );
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = Ya(r)),
        new r((o, i) => {
          let s = new je({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                i(c), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [Et]() {
      return this;
    }
    pipe(...n) {
      return Za(n)(this);
    }
    toPromise(n) {
      return (
        (n = Ya(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i)
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function Ya(e) {
  var t;
  return (t = e ?? fe.Promise) !== null && t !== void 0 ? t : Promise;
}
function Rf(e) {
  return e && b(e.next) && b(e.error) && b(e.complete);
}
function Ff(e) {
  return (e && e instanceof ot) || (Rf(e) && Gn(e));
}
function Pf(e) {
  return b(e?.lift);
}
function Y(e) {
  return (t) => {
    if (Pf(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function Q(e, t, n, r, o) {
  return new Wo(e, t, n, r, o);
}
var Wo = class extends ot {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              t.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              t.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
var Qa = yt(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var Se = (() => {
    class e extends k {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new qn(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new Qa();
      }
      next(n) {
        Dt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        Dt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        Dt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? Bo
          : ((this.currentObservers = null),
            i.push(n),
            new z(() => {
              (this.currentObservers = null), Yt(i, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new k();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new qn(t, n)), e;
  })(),
  qn = class extends Se {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n);
    }
    next(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : Bo;
    }
  };
var Qt = class extends Se {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return !n.closed && t.next(this._value), n;
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return this._throwIfClosed(), r;
  }
  next(t) {
    super.next((this._value = t));
  }
};
function Ka(e) {
  return e && b(e.schedule);
}
function Ja(e) {
  return e[e.length - 1];
}
function Xa(e) {
  return b(Ja(e)) ? e.pop() : void 0;
}
function ec(e) {
  return Ka(Ja(e)) ? e.pop() : void 0;
}
function nc(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(l) {
      try {
        u(r.next(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      try {
        u(r.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      l.done ? i(l.value) : o(l.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
}
function tc(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function it(e) {
  return this instanceof it ? ((this.v = e), this) : new it(e);
}
function rc(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype
    )),
    a("next"),
    a("throw"),
    a("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (p) {
      return Promise.resolve(p).then(f, d);
    };
  }
  function a(f, p) {
    r[f] &&
      ((o[f] = function (g) {
        return new Promise(function (y, C) {
          i.push([f, g, y, C]) > 1 || c(f, g);
        });
      }),
      p && (o[f] = p(o[f])));
  }
  function c(f, p) {
    try {
      u(r[f](p));
    } catch (g) {
      h(i[0][3], g);
    }
  }
  function u(f) {
    f.value instanceof it
      ? Promise.resolve(f.value.v).then(l, d)
      : h(i[0][2], f);
  }
  function l(f) {
    c("next", f);
  }
  function d(f) {
    c("throw", f);
  }
  function h(f, p) {
    f(p), i.shift(), i.length && c(i[0][0], i[0][1]);
  }
}
function oc(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof tc == "function" ? tc(e) : e[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = e[i](s)), o(a, c, s.done, s.value);
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (u) {
      i({ value: u, done: a });
    }, s);
  }
}
var Zn = (e) => e && typeof e.length == "number" && typeof e != "function";
function Yn(e) {
  return b(e?.then);
}
function Qn(e) {
  return b(e[Et]);
}
function Kn(e) {
  return Symbol.asyncIterator && b(e?.[Symbol.asyncIterator]);
}
function Jn(e) {
  return new TypeError(
    `You provided ${
      e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function kf() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Xn = kf();
function er(e) {
  return b(e?.[Xn]);
}
function tr(e) {
  return rc(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield it(n.read());
        if (o) return yield it(void 0);
        yield yield it(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function nr(e) {
  return b(e?.getReader);
}
function K(e) {
  if (e instanceof k) return e;
  if (e != null) {
    if (Qn(e)) return Lf(e);
    if (Zn(e)) return Vf(e);
    if (Yn(e)) return jf(e);
    if (Kn(e)) return ic(e);
    if (er(e)) return Bf(e);
    if (nr(e)) return Hf(e);
  }
  throw Jn(e);
}
function Lf(e) {
  return new k((t) => {
    let n = e[Et]();
    if (b(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function Vf(e) {
  return new k((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function jf(e) {
  return new k((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n)
    ).then(null, zn);
  });
}
function Bf(e) {
  return new k((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function ic(e) {
  return new k((t) => {
    Uf(e, t).catch((n) => t.error(n));
  });
}
function Hf(e) {
  return ic(tr(e));
}
function Uf(e, t) {
  var n, r, o, i;
  return nc(this, void 0, void 0, function* () {
    try {
      for (n = oc(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function oe(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function rr(e, t = 0) {
  return Y((n, r) => {
    n.subscribe(
      Q(
        r,
        (o) => oe(r, e, () => r.next(o), t),
        () => oe(r, e, () => r.complete(), t),
        (o) => oe(r, e, () => r.error(o), t)
      )
    );
  });
}
function or(e, t = 0) {
  return Y((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function sc(e, t) {
  return K(e).pipe(or(t), rr(t));
}
function ac(e, t) {
  return K(e).pipe(or(t), rr(t));
}
function cc(e, t) {
  return new k((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function uc(e, t) {
  return new k((n) => {
    let r;
    return (
      oe(n, t, () => {
        (r = e[Xn]()),
          oe(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0
          );
      }),
      () => b(r?.return) && r.return()
    );
  });
}
function ir(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new k((n) => {
    oe(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      oe(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function lc(e, t) {
  return ir(tr(e), t);
}
function dc(e, t) {
  if (e != null) {
    if (Qn(e)) return sc(e, t);
    if (Zn(e)) return cc(e, t);
    if (Yn(e)) return ac(e, t);
    if (Kn(e)) return ir(e, t);
    if (er(e)) return uc(e, t);
    if (nr(e)) return lc(e, t);
  }
  throw Jn(e);
}
function st(e, t) {
  return t ? dc(e, t) : K(e);
}
function sr(...e) {
  let t = ec(e);
  return st(e, t);
}
var fc = yt(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function qo(e, t) {
  let n = typeof t == "object";
  return new Promise((r, o) => {
    let i = new je({
      next: (s) => {
        r(s), i.unsubscribe();
      },
      error: o,
      complete: () => {
        n ? r(t.defaultValue) : o(new fc());
      },
    });
    e.subscribe(i);
  });
}
function J(e, t) {
  return Y((n, r) => {
    let o = 0;
    n.subscribe(
      Q(r, (i) => {
        r.next(e.call(t, i, o++));
      })
    );
  });
}
var { isArray: $f } = Array;
function Gf(e, t) {
  return $f(t) ? e(...t) : e(t);
}
function hc(e) {
  return J((t) => Gf(e, t));
}
var { isArray: zf } = Array,
  { getPrototypeOf: Wf, prototype: qf, keys: Zf } = Object;
function pc(e) {
  if (e.length === 1) {
    let t = e[0];
    if (zf(t)) return { args: t, keys: null };
    if (Yf(t)) {
      let n = Zf(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function Yf(e) {
  return e && typeof e == "object" && Wf(e) === qf;
}
function gc(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function mc(e, t, n, r, o, i, s, a) {
  let c = [],
    u = 0,
    l = 0,
    d = !1,
    h = () => {
      d && !c.length && !u && t.complete();
    },
    f = (g) => (u < r ? p(g) : c.push(g)),
    p = (g) => {
      i && t.next(g), u++;
      let y = !1;
      K(n(g, l++)).subscribe(
        Q(
          t,
          (C) => {
            o?.(C), i ? f(C) : t.next(C);
          },
          () => {
            y = !0;
          },
          void 0,
          () => {
            if (y)
              try {
                for (u--; c.length && u < r; ) {
                  let C = c.shift();
                  s ? oe(t, s, () => p(C)) : p(C);
                }
                h();
              } catch (C) {
                t.error(C);
              }
          }
        )
      );
    };
  return (
    e.subscribe(
      Q(t, f, () => {
        (d = !0), h();
      })
    ),
    () => {
      a?.();
    }
  );
}
function ar(e, t, n = 1 / 0) {
  return b(t)
    ? ar((r, o) => J((i, s) => t(r, i, o, s))(K(e(r, o))), n)
    : (typeof t == "number" && (n = t), Y((r, o) => mc(r, o, e, n)));
}
function Zo(...e) {
  let t = Xa(e),
    { args: n, keys: r } = pc(e),
    o = new k((i) => {
      let { length: s } = n;
      if (!s) {
        i.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        u = s;
      for (let l = 0; l < s; l++) {
        let d = !1;
        K(n[l]).subscribe(
          Q(
            i,
            (h) => {
              d || ((d = !0), u--), (a[l] = h);
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (u || i.next(r ? gc(r, a) : a), i.complete());
            }
          )
        );
      }
    });
  return t ? o.pipe(hc(t)) : o;
}
function Yo(e, t) {
  return Y((n, r) => {
    let o = 0;
    n.subscribe(Q(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function Qo(e, t) {
  return b(t) ? ar(e, t, 1) : ar(e, 1);
}
function Ko(e) {
  return Y((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Jo(e, t) {
  return Y((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      Q(
        r,
        (c) => {
          o?.unsubscribe();
          let u = 0,
            l = i++;
          K(e(c, l)).subscribe(
            (o = Q(
              r,
              (d) => r.next(t ? t(c, d, l, u++) : d),
              () => {
                (o = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
var Qf = "https://g.co/ng/security#xss",
  E = class extends Error {
    code;
    constructor(t, n) {
      super(Lr(t, n)), (this.code = t);
    }
  };
function Lr(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function Vr(e) {
  return { toString: e }.toString();
}
var Re = globalThis;
function x(e) {
  for (let t in e) if (e[t] === x) return t;
  throw Error("Could not find renamed property on target object.");
}
function Kf(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function X(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(X).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function yc(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
    ? e
    : e + " " + t;
}
var Jf = x({ __forward_ref__: x });
function _e(e) {
  return (
    (e.__forward_ref__ = _e),
    (e.toString = function () {
      return X(this());
    }),
    e
  );
}
function W(e) {
  return eu(e) ? e() : e;
}
function eu(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(Jf) && e.__forward_ref__ === _e
  );
}
function S(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function me(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function ss(e) {
  return vc(e, tu) || vc(e, nu);
}
function vc(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function Xf(e) {
  let t = e && (e[tu] || e[nu]);
  return t || null;
}
function Dc(e) {
  return e && (e.hasOwnProperty(Ec) || e.hasOwnProperty(eh)) ? e[Ec] : null;
}
var tu = x({ ɵprov: x }),
  Ec = x({ ɵinj: x }),
  nu = x({ ngInjectableDef: x }),
  eh = x({ ngInjectorDef: x }),
  m = class {
    _desc;
    ngMetadataName = "InjectionToken";
    ɵprov;
    constructor(t, n) {
      (this._desc = t),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = S({
              token: this,
              providedIn: n.providedIn || "root",
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function ru(e) {
  return e && !!e.ɵproviders;
}
var th = x({ ɵcmp: x }),
  nh = x({ ɵdir: x }),
  rh = x({ ɵpipe: x }),
  oh = x({ ɵmod: x }),
  gr = x({ ɵfac: x }),
  en = x({ __NG_ELEMENT_ID__: x }),
  wc = x({ __NG_ENV_ID__: x });
function ou(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function ih(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
    ? e.type.name || e.type.toString()
    : ou(e);
}
function sh(e, t) {
  let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new E(-200, e);
}
function as(e, t) {
  throw new E(-201, !1);
}
var M = (function (e) {
    return (
      (e[(e.Default = 0)] = "Default"),
      (e[(e.Host = 1)] = "Host"),
      (e[(e.Self = 2)] = "Self"),
      (e[(e.SkipSelf = 4)] = "SkipSelf"),
      (e[(e.Optional = 8)] = "Optional"),
      e
    );
  })(M || {}),
  di;
function iu() {
  return di;
}
function ie(e) {
  let t = di;
  return (di = e), t;
}
function su(e, t, n) {
  let r = ss(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & M.Optional) return null;
  if (t !== void 0) return t;
  as(e, "Injector");
}
var ah = {},
  nn = ah,
  ch = "__NG_DI_FLAG__",
  mr = "ngTempTokenPath",
  uh = "ngTokenPath",
  lh = /\n/gm,
  dh = "\u0275",
  Cc = "__source",
  It;
function fh() {
  return It;
}
function Be(e) {
  let t = It;
  return (It = e), t;
}
function hh(e, t = M.Default) {
  if (It === void 0) throw new E(-203, !1);
  return It === null
    ? su(e, void 0, t)
    : It.get(e, t & M.Optional ? null : void 0, t);
}
function w(e, t = M.Default) {
  return (iu() || hh)(W(e), t);
}
function D(e, t = M.Default) {
  return w(e, jr(t));
}
function jr(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function fi(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = W(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new E(900, !1);
      let o,
        i = M.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = ph(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push(w(o, i));
    } else t.push(w(r));
  }
  return t;
}
function ph(e) {
  return e[ch];
}
function gh(e, t, n, r) {
  let o = e[mr];
  throw (
    (t[Cc] && o.unshift(t[Cc]),
    (e.message = mh(
      `
` + e.message,
      o,
      n,
      r
    )),
    (e[uh] = o),
    (e[mr] = null),
    e)
  );
}
function mh(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == dh
      ? e.slice(2)
      : e;
  let o = X(t);
  if (Array.isArray(t)) o = t.map(X).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : X(a)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
    lh,
    `
  `
  )}`;
}
function Mt(e, t) {
  let n = e.hasOwnProperty(gr);
  return n ? e[gr] : null;
}
function cs(e, t) {
  e.forEach((n) => (Array.isArray(n) ? cs(n, t) : t(n)));
}
function yh(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function au(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function vh(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) e.push(r, e[0]), (e[0] = n);
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      (e[o] = e[i]), o--;
    }
    (e[t] = n), (e[t + 1] = r);
  }
}
function Dh(e, t, n) {
  let r = fn(e, t);
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), vh(e, r, t, n)), r;
}
function Xo(e, t) {
  let n = fn(e, t);
  if (n >= 0) return e[n | 1];
}
function fn(e, t) {
  return Eh(e, t, 1);
}
function Eh(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var Tt = {},
  se = [],
  rn = new m(""),
  cu = new m("", -1),
  uu = new m(""),
  yr = class {
    get(t, n = nn) {
      if (n === nn) {
        let r = new Error(`NullInjectorError: No provider for ${X(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  };
function wh(e, t) {
  let n = e[oh] || null;
  if (!n && t === !0)
    throw new Error(`Type ${X(e)} does not have '\u0275mod' property.`);
  return n;
}
function Br(e) {
  return e[th] || null;
}
function lu(e) {
  return e[nh] || null;
}
function du(e) {
  return e[rh] || null;
}
function Ch(e) {
  let t = Br(e) || lu(e) || du(e);
  return t !== null ? t.standalone : !1;
}
function us(e) {
  return { ɵproviders: e };
}
function _h(...e) {
  return { ɵproviders: fu(!0, e), ɵfromNgModule: !0 };
}
function fu(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    cs(t, (s) => {
      let a = s;
      hi(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && hu(o, i),
    n
  );
}
function hu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    ls(o, (i) => {
      t(i, r);
    });
  }
}
function hi(e, t, n, r) {
  if (((e = W(e)), !e)) return !1;
  let o = null,
    i = Dc(e),
    s = !i && Br(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = Dc(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let u of c) hi(u, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let u;
      try {
        cs(i.imports, (l) => {
          hi(l, t, n, r) && ((u ||= []), u.push(l));
        });
      } finally {
      }
      u !== void 0 && hu(u, t);
    }
    if (!a) {
      let u = Mt(o) || (() => new o());
      t({ provide: o, useFactory: u, deps: se }, o),
        t({ provide: uu, useValue: o, multi: !0 }, o),
        t({ provide: rn, useValue: () => w(o), multi: !0 }, o);
    }
    let c = i.providers;
    if (c != null && !a) {
      let u = e;
      ls(c, (l) => {
        t(l, u);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function ls(e, t) {
  for (let n of e)
    ru(n) && (n = n.ɵproviders), Array.isArray(n) ? ls(n, t) : t(n);
}
var Ih = x({ provide: String, useValue: x });
function pu(e) {
  return e !== null && typeof e == "object" && Ih in e;
}
function bh(e) {
  return !!(e && e.useExisting);
}
function Mh(e) {
  return !!(e && e.useFactory);
}
function St(e) {
  return typeof e == "function";
}
function Th(e) {
  return !!e.useClass;
}
var Hr = new m(""),
  dr = {},
  Sh = {},
  ei;
function ds() {
  return ei === void 0 && (ei = new yr()), ei;
}
var Ne = class {},
  on = class extends Ne {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        gi(t, (s) => this.processProvider(s)),
        this.records.set(cu, wt(void 0, this)),
        o.has("environment") && this.records.set(Ne, wt(void 0, this));
      let i = this.records.get(Hr);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(uu, se, M.Self)));
    }
    destroy() {
      Jt(this), (this._destroyed = !0);
      let t = I(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          I(t);
      }
    }
    onDestroy(t) {
      return (
        Jt(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      Jt(this);
      let n = Be(this),
        r = ie(void 0),
        o;
      try {
        return t();
      } finally {
        Be(n), ie(r);
      }
    }
    get(t, n = nn, r = M.Default) {
      if ((Jt(this), t.hasOwnProperty(wc))) return t[wc](this);
      r = jr(r);
      let o,
        i = Be(this),
        s = ie(void 0);
      try {
        if (!(r & M.SkipSelf)) {
          let c = this.records.get(t);
          if (c === void 0) {
            let u = Rh(t) && ss(t);
            u && this.injectableDefInScope(u)
              ? (c = wt(pi(t), dr))
              : (c = null),
              this.records.set(t, c);
          }
          if (c != null) return this.hydrate(t, c);
        }
        let a = r & M.Self ? ds() : this.parent;
        return (n = r & M.Optional && n === nn ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[mr] = a[mr] || []).unshift(X(t)), i)) throw a;
          return gh(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        ie(s), Be(i);
      }
    }
    resolveInjectorInitializers() {
      let t = I(null),
        n = Be(this),
        r = ie(void 0),
        o;
      try {
        let i = this.get(rn, se, M.Self);
        for (let s of i) s();
      } finally {
        Be(n), ie(r), I(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(X(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    processProvider(t) {
      t = W(t);
      let n = St(t) ? t : W(t && t.provide),
        r = Ah(t);
      if (!St(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = wt(void 0, dr, !0)),
          (o.factory = () => fi(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n) {
      let r = I(null);
      try {
        return (
          n.value === dr && ((n.value = Sh), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            Oh(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        I(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = W(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function pi(e) {
  let t = ss(e),
    n = t !== null ? t.factory : Mt(e);
  if (n !== null) return n;
  if (e instanceof m) throw new E(204, !1);
  if (e instanceof Function) return Nh(e);
  throw new E(204, !1);
}
function Nh(e) {
  if (e.length > 0) throw new E(204, !1);
  let n = Xf(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function Ah(e) {
  if (pu(e)) return wt(void 0, e.useValue);
  {
    let t = gu(e);
    return wt(t, dr);
  }
}
function gu(e, t, n) {
  let r;
  if (St(e)) {
    let o = W(e);
    return Mt(o) || pi(o);
  } else if (pu(e)) r = () => W(e.useValue);
  else if (Mh(e)) r = () => e.useFactory(...fi(e.deps || []));
  else if (bh(e)) r = () => w(W(e.useExisting));
  else {
    let o = W(e && (e.useClass || e.provide));
    if (xh(e)) r = () => new o(...fi(e.deps));
    else return Mt(o) || pi(o);
  }
  return r;
}
function Jt(e) {
  if (e.destroyed) throw new E(205, !1);
}
function wt(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function xh(e) {
  return !!e.deps;
}
function Oh(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function Rh(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof m);
}
function gi(e, t) {
  for (let n of e)
    Array.isArray(n) ? gi(n, t) : n && ru(n) ? gi(n.ɵproviders, t) : t(n);
}
function Ur(e, t) {
  e instanceof on && Jt(e);
  let n,
    r = Be(e),
    o = ie(void 0);
  try {
    return t();
  } finally {
    Be(r), ie(o);
  }
}
function Fh() {
  return iu() !== void 0 || fh() != null;
}
function Ph(e) {
  let t = Re.ng;
  if (t && t.ɵcompilerFacade) return t.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
var Fe = 0,
  _ = 1,
  v = 2,
  ae = 3,
  pe = 4,
  Ie = 5,
  sn = 6,
  vr = 7,
  $ = 8,
  Nt = 9,
  $e = 10,
  q = 11,
  an = 12,
  _c = 13,
  Lt = 14,
  we = 15,
  At = 16,
  Ct = 17,
  xt = 18,
  $r = 19,
  mu = 20,
  He = 21,
  ti = 22,
  Dr = 23,
  ne = 24,
  ge = 25,
  yu = 1;
var cn = 7,
  kh = 8,
  Er = 9,
  ee = 10,
  wr = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(wr || {});
function Ue(e) {
  return Array.isArray(e) && typeof e[yu] == "object";
}
function ft(e) {
  return Array.isArray(e) && e[yu] === !0;
}
function vu(e) {
  return (e.flags & 4) !== 0;
}
function fs(e) {
  return e.componentOffset > -1;
}
function hs(e) {
  return (e.flags & 1) === 1;
}
function Ge(e) {
  return !!e.template;
}
function mi(e) {
  return (e[v] & 512) !== 0;
}
var yi = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Du(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
var hn = (() => {
  let e = () => Eu;
  return (e.ngInherit = !0), e;
})();
function Eu(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = Vh), Lh;
}
function Lh() {
  let e = Cu(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === Tt) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function Vh(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = Cu(e) || jh(e, { previous: Tt, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    u = c[i];
  (a[i] = new yi(u && u.currentValue, n, c === Tt)), Du(e, t, o, n);
}
var wu = "__ngSimpleChanges__";
function Cu(e) {
  return e[wu] || null;
}
function jh(e, t) {
  return (e[wu] = t);
}
var Ic = null;
var De = function (e, t, n) {
    Ic?.(e, t, n);
  },
  Bh = "svg",
  Hh = "math";
function Ae(e) {
  for (; Array.isArray(e); ) e = e[Fe];
  return e;
}
function Uh(e, t) {
  return Ae(t[e]);
}
function ye(e, t) {
  return Ae(t[e.index]);
}
function ps(e, t) {
  return e.data[t];
}
function ht(e, t) {
  let n = t[e];
  return Ue(n) ? n : n[Fe];
}
function gs(e) {
  return (e[v] & 128) === 128;
}
function Ot(e, t) {
  return t == null ? null : e[t];
}
function _u(e) {
  e[Ct] = 0;
}
function ms(e) {
  e[v] & 1024 || ((e[v] |= 1024), gs(e) && zr(e));
}
function $h(e, t) {
  for (; e > 0; ) (t = t[Lt]), e--;
  return t;
}
function Gr(e) {
  return !!(e[v] & 9216 || e[ne]?.dirty);
}
function vi(e) {
  e[$e].changeDetectionScheduler?.notify(9),
    e[v] & 64 && (e[v] |= 1024),
    Gr(e) && zr(e);
}
function zr(e) {
  e[$e].changeDetectionScheduler?.notify(0);
  let t = at(e);
  for (; t !== null && !(t[v] & 8192 || ((t[v] |= 8192), !gs(t))); ) t = at(t);
}
function Iu(e, t) {
  if ((e[v] & 256) === 256) throw new E(911, !1);
  e[He] === null && (e[He] = []), e[He].push(t);
}
function Gh(e, t) {
  if (e[He] === null) return;
  let n = e[He].indexOf(t);
  n !== -1 && e[He].splice(n, 1);
}
function at(e) {
  let t = e[ae];
  return ft(t) ? t[ae] : t;
}
var T = { lFrame: Fu(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var Di = !1;
function zh() {
  return T.lFrame.elementDepthCount;
}
function Wh() {
  T.lFrame.elementDepthCount++;
}
function qh() {
  T.lFrame.elementDepthCount--;
}
function bu() {
  return T.bindingsEnabled;
}
function Zh() {
  return T.skipHydrationRootTNode !== null;
}
function Yh(e) {
  return T.skipHydrationRootTNode === e;
}
function Qh() {
  T.skipHydrationRootTNode = null;
}
function L() {
  return T.lFrame.lView;
}
function ce() {
  return T.lFrame.tView;
}
function Mu(e) {
  return (T.lFrame.contextLView = e), e[$];
}
function Tu(e) {
  return (T.lFrame.contextLView = null), e;
}
function be() {
  let e = Su();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function Su() {
  return T.lFrame.currentTNode;
}
function Kh() {
  let e = T.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function pn(e, t) {
  let n = T.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function Nu() {
  return T.lFrame.isParent;
}
function Jh() {
  T.lFrame.isParent = !1;
}
function Au() {
  return Di;
}
function bc(e) {
  let t = Di;
  return (Di = e), t;
}
function Xh(e) {
  return (T.lFrame.bindingIndex = e);
}
function Wr() {
  return T.lFrame.bindingIndex++;
}
function ep(e) {
  let t = T.lFrame,
    n = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), n;
}
function tp() {
  return T.lFrame.inI18n;
}
function np(e, t) {
  let n = T.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), Ei(t);
}
function rp() {
  return T.lFrame.currentDirectiveIndex;
}
function Ei(e) {
  T.lFrame.currentDirectiveIndex = e;
}
function op(e) {
  let t = T.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function xu(e) {
  T.lFrame.currentQueryIndex = e;
}
function ip(e) {
  let t = e[_];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Ie] : null;
}
function Ou(e, t, n) {
  if (n & M.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & M.Host); )
      if (((o = ip(i)), o === null || ((i = i[Lt]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (T.lFrame = Ru());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function ys(e) {
  let t = Ru(),
    n = e[_];
  (T.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function Ru() {
  let e = T.lFrame,
    t = e === null ? null : e.child;
  return t === null ? Fu(e) : t;
}
function Fu(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function Pu() {
  let e = T.lFrame;
  return (T.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var ku = Pu;
function vs() {
  let e = Pu();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function sp(e) {
  return (T.lFrame.contextLView = $h(e, T.lFrame.contextLView))[$];
}
function Vt() {
  return T.lFrame.selectedIndex;
}
function ct(e) {
  T.lFrame.selectedIndex = e;
}
function Lu() {
  let e = T.lFrame;
  return ps(e.tView, e.selectedIndex);
}
function ap() {
  return T.lFrame.currentNamespace;
}
var Vu = !0;
function Ds() {
  return Vu;
}
function Es(e) {
  Vu = e;
}
function cp(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = Eu(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function ws(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: u,
        ngOnDestroy: l,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      c && (e.viewHooks ??= []).push(-n, c),
      u &&
        ((e.viewHooks ??= []).push(n, u), (e.viewCheckHooks ??= []).push(n, u)),
      l != null && (e.destroyHooks ??= []).push(n, l);
  }
}
function fr(e, t, n) {
  ju(e, t, 3, n);
}
function hr(e, t, n, r) {
  (e[v] & 3) === n && ju(e, t, n, r);
}
function ni(e, t) {
  let n = e[v];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[v] = n));
}
function ju(e, t, n, r) {
  let o = r !== void 0 ? e[Ct] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == "number") {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      t[c] < 0 && (e[Ct] += 65536),
        (a < i || i == -1) &&
          (up(e, n, t, c), (e[Ct] = (e[Ct] & 4294901760) + c + 2)),
        c++;
}
function Mc(e, t) {
  De(4, e, t);
  let n = I(null);
  try {
    t.call(e);
  } finally {
    I(n), De(5, e, t);
  }
}
function up(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[v] >> 14 < e[Ct] >> 16 &&
      (e[v] & 3) === t &&
      ((e[v] += 16384), Mc(a, i))
    : Mc(a, i);
}
var bt = -1,
  ut = class {
    factory;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, r) {
      (this.factory = t), (this.canSeeViewProviders = n), (this.injectImpl = r);
    }
  };
function lp(e) {
  return e instanceof ut;
}
function dp(e) {
  return (e.flags & 8) !== 0;
}
function fp(e) {
  return (e.flags & 16) !== 0;
}
function wi(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      pp(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function hp(e) {
  return e === 3 || e === 4 || e === 6;
}
function pp(e) {
  return e.charCodeAt(0) === 64;
}
function un(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number"
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? Tc(e, n, o, null, t[++r])
              : Tc(e, n, o, null, null));
      }
    }
  return e;
}
function Tc(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        o !== null && (e[i + 1] = o);
        return;
      } else if (r === e[i + 1]) {
        e[i + 2] = o;
        return;
      }
    }
    i++, r !== null && i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    r !== null && e.splice(i++, 0, r),
    o !== null && e.splice(i++, 0, o);
}
var ri = {},
  Ci = class {
    injector;
    parentInjector;
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = jr(r);
      let o = this.injector.get(t, ri, r);
      return o !== ri || n === ri ? o : this.parentInjector.get(t, n, r);
    }
  };
function gp(e) {
  return e !== bt;
}
function _i(e) {
  return e & 32767;
}
function mp(e) {
  return e >> 16;
}
function Ii(e, t) {
  let n = mp(e),
    r = t;
  for (; n > 0; ) (r = r[Lt]), n--;
  return r;
}
var bi = !0;
function Sc(e) {
  let t = bi;
  return (bi = e), t;
}
var yp = 256,
  Bu = yp - 1,
  Hu = 5,
  vp = 0,
  Ee = {};
function Dp(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(en) && (r = n[en]),
    r == null && (r = n[en] = vp++);
  let o = r & Bu,
    i = 1 << o;
  t.data[e + (o >> Hu)] |= i;
}
function Cr(e, t) {
  let n = Uu(e, t);
  if (n !== -1) return n;
  let r = t[_];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    oi(r.data, e),
    oi(t, null),
    oi(r.blueprint, null));
  let o = $u(e, t),
    i = e.injectorIndex;
  if (gp(o)) {
    let s = _i(o),
      a = Ii(o, t),
      c = a[_].data;
    for (let u = 0; u < 8; u++) t[i + u] = a[s + u] | c[s + u];
  }
  return (t[i + 8] = o), i;
}
function oi(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function Uu(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function $u(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Zu(o)), r === null)) return bt;
    if ((n++, (o = o[Lt]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return bt;
}
function Mi(e, t, n) {
  Dp(e, t, n);
}
function Gu(e, t, n) {
  if (n & M.Optional || e !== void 0) return e;
  as(t, "NodeInjector");
}
function zu(e, t, n, r) {
  if (
    (n & M.Optional && r === void 0 && (r = null), !(n & (M.Self | M.Host)))
  ) {
    let o = e[Nt],
      i = ie(void 0);
    try {
      return o ? o.get(t, r, n & M.Optional) : su(t, r, n & M.Optional);
    } finally {
      ie(i);
    }
  }
  return Gu(r, t, n);
}
function Wu(e, t, n, r = M.Default, o) {
  if (e !== null) {
    if (t[v] & 2048 && !(r & M.Self)) {
      let s = Ip(e, t, n, r, Ee);
      if (s !== Ee) return s;
    }
    let i = qu(e, t, n, r, Ee);
    if (i !== Ee) return i;
  }
  return zu(t, n, r, o);
}
function qu(e, t, n, r, o) {
  let i = Cp(n);
  if (typeof i == "function") {
    if (!Ou(t, e, r)) return r & M.Host ? Gu(o, n, r) : zu(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & M.Optional))) as(n);
      else return s;
    } finally {
      ku();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Uu(e, t),
      c = bt,
      u = r & M.Host ? t[we][Ie] : null;
    for (
      (a === -1 || r & M.SkipSelf) &&
      ((c = a === -1 ? $u(e, t) : t[a + 8]),
      c === bt || !Ac(r, !1)
        ? (a = -1)
        : ((s = t[_]), (a = _i(c)), (t = Ii(c, t))));
      a !== -1;

    ) {
      let l = t[_];
      if (Nc(i, a, l.data)) {
        let d = Ep(a, t, n, s, r, u);
        if (d !== Ee) return d;
      }
      (c = t[a + 8]),
        c !== bt && Ac(r, t[_].data[a + 8] === u) && Nc(i, a, t)
          ? ((s = l), (a = _i(c)), (t = Ii(c, t)))
          : (a = -1);
    }
  }
  return o;
}
function Ep(e, t, n, r, o, i) {
  let s = t[_],
    a = s.data[e + 8],
    c = r == null ? fs(a) && bi : r != s && (a.type & 3) !== 0,
    u = o & M.Host && i === a,
    l = wp(a, s, n, c, u);
  return l !== null ? Rt(t, s, l, a) : Ee;
}
function wp(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    c = e.directiveStart,
    u = e.directiveEnd,
    l = i >> 20,
    d = r ? a : a + l,
    h = o ? a + l : u;
  for (let f = d; f < h; f++) {
    let p = s[f];
    if ((f < c && n === p) || (f >= c && p.type === n)) return f;
  }
  if (o) {
    let f = s[c];
    if (f && Ge(f) && f.type === n) return c;
  }
  return null;
}
function Rt(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (lp(o)) {
    let s = o;
    s.resolving && sh(ih(i[n]));
    let a = Sc(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      u = s.injectImpl ? ie(s.injectImpl) : null,
      l = Ou(e, r, M.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && cp(n, i[n], t);
    } finally {
      u !== null && ie(u), Sc(a), (s.resolving = !1), ku();
    }
  }
  return o;
}
function Cp(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(en) ? e[en] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & Bu : _p) : t;
}
function Nc(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> Hu)] & r);
}
function Ac(e, t) {
  return !(e & M.Self) && !(e & M.Host && t);
}
var _r = class {
  _tNode;
  _lView;
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return Wu(this._tNode, this._lView, t, jr(r), n);
  }
};
function _p() {
  return new _r(be(), L());
}
function gn(e) {
  return Vr(() => {
    let t = e.prototype.constructor,
      n = t[gr] || Ti(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[gr] || Ti(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function Ti(e) {
  return eu(e)
    ? () => {
        let t = Ti(W(e));
        return t && t();
      }
    : Mt(e);
}
function Ip(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[v] & 2048 && !(s[v] & 512); ) {
    let a = qu(i, s, n, r | M.Self, Ee);
    if (a !== Ee) return a;
    let c = i.parent;
    if (!c) {
      let u = s[mu];
      if (u) {
        let l = u.get(n, Ee, r);
        if (l !== Ee) return l;
      }
      (c = Zu(s)), (s = s[Lt]);
    }
    i = c;
  }
  return o;
}
function Zu(e) {
  let t = e[_],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[Ie] : null;
}
function xc(e, t = null, n = null, r) {
  let o = Yu(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function Yu(e, t = null, n = null, r, o = new Set()) {
  let i = [n || se, _h(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : X(e))),
    new on(i, t || ds(), r || null, o)
  );
}
var xe = class e {
  static THROW_IF_NOT_FOUND = nn;
  static NULL = new yr();
  static create(t, n) {
    if (Array.isArray(t)) return xc({ name: "" }, n, t, "");
    {
      let r = t.name ?? "";
      return xc({ name: r }, t.parent, t.providers, r);
    }
  }
  static ɵprov = S({ token: e, providedIn: "any", factory: () => w(cu) });
  static __NG_ELEMENT_ID__ = -1;
};
var bp = new m("");
bp.__NG_ELEMENT_ID__ = (e) => {
  let t = be();
  if (t === null) throw new E(204, !1);
  if (t.type & 2) return t.value;
  if (e & M.Optional) return null;
  throw new E(204, !1);
};
var Qu = !1,
  Ku = (() => {
    class e {
      static __NG_ELEMENT_ID__ = Mp;
      static __NG_ENV_ID__ = (n) => n;
    }
    return e;
  })(),
  Si = class extends Ku {
    _lView;
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return Iu(this._lView, t), () => Gh(this._lView, t);
    }
  };
function Mp() {
  return new Si(L());
}
var ln = class {},
  Cs = new m("", { providedIn: "root", factory: () => !1 });
var Ju = new m(""),
  Xu = new m(""),
  jt = (() => {
    class e {
      taskId = 0;
      pendingTasks = new Set();
      get _hasPendingTasks() {
        return this.hasPendingTasks.value;
      }
      hasPendingTasks = new Qt(!1);
      add() {
        this._hasPendingTasks || this.hasPendingTasks.next(!0);
        let n = this.taskId++;
        return this.pendingTasks.add(n), n;
      }
      has(n) {
        return this.pendingTasks.has(n);
      }
      remove(n) {
        this.pendingTasks.delete(n),
          this.pendingTasks.size === 0 &&
            this._hasPendingTasks &&
            this.hasPendingTasks.next(!1);
      }
      ngOnDestroy() {
        this.pendingTasks.clear(),
          this._hasPendingTasks && this.hasPendingTasks.next(!1);
      }
      static ɵprov = S({
        token: e,
        providedIn: "root",
        factory: () => new e(),
      });
    }
    return e;
  })();
var Ni = class extends Se {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = !1) {
      super(),
        (this.__isAsync = t),
        Fh() &&
          ((this.destroyRef = D(Ku, { optional: !0 }) ?? void 0),
          (this.pendingTasks = D(jt, { optional: !0 }) ?? void 0));
    }
    emit(t) {
      let n = I(null);
      try {
        super.next(t);
      } finally {
        I(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == "object") {
        let c = t;
        (o = c.next?.bind(c)),
          (i = c.error?.bind(c)),
          (s = c.complete?.bind(c));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return t instanceof z && t.add(a), a;
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          t(n), r !== void 0 && this.pendingTasks?.remove(r);
        });
      };
    }
  },
  te = Ni;
function Ir(...e) {}
function el(e) {
  let t, n;
  function r() {
    e = Ir;
    try {
      n !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t);
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      e(), r();
    })),
    typeof requestAnimationFrame == "function" &&
      (n = requestAnimationFrame(() => {
        e(), r();
      })),
    () => r()
  );
}
function Oc(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = Ir;
    }
  );
}
var _s = "isAngularZone",
  br = _s + "_ID",
  Tp = 0,
  F = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new te(!1);
    onMicrotaskEmpty = new te(!1);
    onStable = new te(!1);
    onError = new te(!1);
    constructor(t) {
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = Qu,
      } = t;
      if (typeof Zone > "u") throw new E(908, !1);
      Zone.assertZonePatched();
      let s = this;
      (s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        Ap(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(_s) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new E(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new E(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, Sp, Ir, Ir);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  Sp = {};
function Is(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function Np(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    el(() => {
      (e.callbackScheduled = !1),
        Ai(e),
        (e.isCheckStableRunning = !0),
        Is(e),
        (e.isCheckStableRunning = !1);
    });
  }
  e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    Ai(e);
}
function Ap(e) {
  let t = () => {
      Np(e);
    },
    n = Tp++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [_s]: !0, [br]: n, [br + n]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (xp(c)) return r.invokeTask(i, s, a, c);
      try {
        return Rc(e), r.invokeTask(i, s, a, c);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          Fc(e);
      }
    },
    onInvoke: (r, o, i, s, a, c, u) => {
      try {
        return Rc(e), r.invoke(i, s, a, c, u);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !Op(c) &&
          t(),
          Fc(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), Ai(e), Is(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function Ai(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Rc(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function Fc(e) {
  e._nesting--, Is(e);
}
var Mr = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new te();
  onMicrotaskEmpty = new te();
  onStable = new te();
  onError = new te();
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function xp(e) {
  return tl(e, "__ignore_ng_zone__");
}
function Op(e) {
  return tl(e, "__scheduler_tick__");
}
function tl(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
function Rp(e = "zone.js", t) {
  return e === "noop" ? new Mr() : e === "zone.js" ? new F(t) : e;
}
var ze = class {
    _console = console;
    handleError(t) {
      this._console.error("ERROR", t);
    }
  },
  Fp = new m("", {
    providedIn: "root",
    factory: () => {
      let e = D(F),
        t = D(ze);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function Pp() {
  return nl(be(), L());
}
function nl(e, t) {
  return new Bt(ye(e, t));
}
var Bt = (() => {
  class e {
    nativeElement;
    constructor(n) {
      this.nativeElement = n;
    }
    static __NG_ELEMENT_ID__ = Pp;
  }
  return e;
})();
function rl(e) {
  return (e.flags & 128) === 128;
}
var ol = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(ol || {}),
  il = new Map(),
  kp = 0;
function Lp() {
  return kp++;
}
function Vp(e) {
  il.set(e[$r], e);
}
function xi(e) {
  il.delete(e[$r]);
}
var Pc = "__ngContext__";
function lt(e, t) {
  Ue(t) ? ((e[Pc] = t[$r]), Vp(t)) : (e[Pc] = t);
}
function sl(e) {
  return cl(e[an]);
}
function al(e) {
  return cl(e[pe]);
}
function cl(e) {
  for (; e !== null && !ft(e); ) e = e[pe];
  return e;
}
var Oi;
function ul(e) {
  Oi = e;
}
function jp() {
  if (Oi !== void 0) return Oi;
  if (typeof document < "u") return document;
  throw new E(210, !1);
}
var bs = new m("", { providedIn: "root", factory: () => Bp }),
  Bp = "ng",
  Ms = new m(""),
  Ye = new m("", { providedIn: "platform", factory: () => "unknown" });
var Ts = new m("", {
  providedIn: "root",
  factory: () =>
    jp().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var Hp = "h",
  Up = "b";
var ll = !1,
  $p = new m("", { providedIn: "root", factory: () => ll });
var dl = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = "CHANGE_DETECTION"),
      (e[(e.AFTER_NEXT_RENDER = 1)] = "AFTER_NEXT_RENDER"),
      e
    );
  })(dl || {}),
  fl = new m(""),
  kc = new Set();
function pt(e) {
  kc.has(e) ||
    (kc.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var Gp = (() => {
  class e {
    impl = null;
    execute() {
      this.impl?.execute();
    }
    static ɵprov = S({ token: e, providedIn: "root", factory: () => new e() });
  }
  return e;
})();
var zp = () => null;
function Ss(e, t, n = !1) {
  return zp(e, t, n);
}
var Ce = (function (e) {
  return (
    (e[(e.Emulated = 0)] = "Emulated"),
    (e[(e.None = 2)] = "None"),
    (e[(e.ShadowDom = 3)] = "ShadowDom"),
    e
  );
})(Ce || {});
var Ri = class {
  changingThisBreaksApplicationSecurity;
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Qf})`;
  }
};
function Ns(e) {
  return e instanceof Ri ? e.changingThisBreaksApplicationSecurity : e;
}
function Wp(e) {
  return e instanceof Function ? e() : e;
}
var We = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(We || {}),
  Oe = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(Oe || {}),
  qp;
function As(e, t) {
  return qp(e, t);
}
function _t(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    ft(r) ? (i = r) : Ue(r) && ((s = !0), (r = r[Fe]));
    let a = Ae(r);
    e === 0 && n !== null
      ? o == null
        ? ml(t, n, a)
        : Fi(t, n, a, o || null, !0)
      : e === 1 && n !== null
      ? Fi(t, n, a, o || null, !0)
      : e === 2
      ? ag(t, a, s)
      : e === 3 && t.destroyNode(a),
      i != null && ug(t, e, i, n, o);
  }
}
function Zp(e, t) {
  return e.createText(t);
}
function hl(e, t, n) {
  return e.createElement(t, n);
}
function Yp(e, t) {
  pl(e, t), (t[Fe] = null), (t[Ie] = null);
}
function Qp(e, t, n, r, o, i) {
  (r[Fe] = o), (r[Ie] = t), qr(e, r, n, 1, o, i);
}
function pl(e, t) {
  t[$e].changeDetectionScheduler?.notify(10), qr(e, t, t[q], 2, null, null);
}
function Kp(e) {
  let t = e[an];
  if (!t) return ii(e[_], e);
  for (; t; ) {
    let n = null;
    if (Ue(t)) n = t[an];
    else {
      let r = t[ee];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[pe] && t !== e; ) Ue(t) && ii(t[_], t), (t = t[ae]);
      t === null && (t = e), Ue(t) && ii(t[_], t), (n = t && t[pe]);
    }
    t = n;
  }
}
function Jp(e, t, n, r) {
  let o = ee + r,
    i = n.length;
  r > 0 && (n[o - 1][pe] = t),
    r < i - ee
      ? ((t[pe] = n[o]), yh(n, ee + r, t))
      : (n.push(t), (t[pe] = null)),
    (t[ae] = n);
  let s = t[At];
  s !== null && n !== s && gl(s, t);
  let a = t[xt];
  a !== null && a.insertView(e), vi(t), (t[v] |= 128);
}
function gl(e, t) {
  let n = e[Er],
    r = t[ae];
  if (Ue(r)) e[v] |= wr.HasTransplantedViews;
  else {
    let o = r[ae][we];
    t[we] !== o && (e[v] |= wr.HasTransplantedViews);
  }
  n === null ? (e[Er] = [t]) : n.push(t);
}
function xs(e, t) {
  let n = e[Er],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Os(e, t) {
  if (e.length <= ee) return;
  let n = ee + t,
    r = e[n];
  if (r) {
    let o = r[At];
    o !== null && o !== e && xs(o, r), t > 0 && (e[n - 1][pe] = r[pe]);
    let i = au(e, ee + t);
    Yp(r[_], r);
    let s = i[xt];
    s !== null && s.detachView(i[_]),
      (r[ae] = null),
      (r[pe] = null),
      (r[v] &= -129);
  }
  return r;
}
function Rs(e, t) {
  if (!(t[v] & 256)) {
    let n = t[q];
    n.destroyNode && qr(e, t, n, 3, null, null), Kp(t);
  }
}
function ii(e, t) {
  if (t[v] & 256) return;
  let n = I(null);
  try {
    (t[v] &= -129),
      (t[v] |= 256),
      t[ne] && Vo(t[ne]),
      eg(e, t),
      Xp(e, t),
      t[_].type === 1 && t[q].destroy();
    let r = t[At];
    if (r !== null && ft(t[ae])) {
      r !== t[ae] && xs(r, t);
      let o = t[xt];
      o !== null && o.detachView(e);
    }
    xi(t);
  } finally {
    I(n);
  }
}
function Xp(e, t) {
  let n = e.cleanup,
    r = t[vr];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == "string") {
        let a = n[s + 3];
        a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2);
      } else {
        let a = r[n[s + 1]];
        n[s].call(a);
      }
  r !== null && (t[vr] = null);
  let o = t[He];
  if (o !== null) {
    t[He] = null;
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      a();
    }
  }
  let i = t[Dr];
  if (i !== null) {
    t[Dr] = null;
    for (let s of i) s.destroy();
  }
}
function eg(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof ut)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            De(4, a, c);
            try {
              c.call(a);
            } finally {
              De(5, a, c);
            }
          }
        else {
          De(4, o, i);
          try {
            i.call(o);
          } finally {
            De(5, o, i);
          }
        }
      }
    }
}
function tg(e, t, n) {
  return ng(e, t.parent, n);
}
function ng(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[Fe];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === Ce.None || i === Ce.Emulated) return null;
    }
    return ye(r, n);
  }
}
function Fi(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function ml(e, t, n) {
  e.appendChild(t, n);
}
function Lc(e, t, n, r, o) {
  r !== null ? Fi(e, t, n, r, o) : ml(e, t, n);
}
function rg(e, t) {
  return e.parentNode(t);
}
function og(e, t, n) {
  return sg(e, t, n);
}
function ig(e, t, n) {
  return e.type & 40 ? ye(e, n) : null;
}
var sg = ig,
  Vc;
function Fs(e, t, n, r) {
  let o = tg(e, r, t),
    i = t[q],
    s = r.parent || t[Ie],
    a = og(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) Lc(i, o, n[c], a, !1);
    else Lc(i, o, n, a, !1);
  Vc !== void 0 && Vc(i, r, t, n, o);
}
function Xt(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return ye(t, e);
    if (n & 4) return Pi(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return Xt(e, r);
      {
        let o = e[t.index];
        return ft(o) ? Pi(-1, o) : Ae(o);
      }
    } else {
      if (n & 128) return Xt(e, t.next);
      if (n & 32) return As(t, e)() || Ae(e[t.index]);
      {
        let r = yl(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = at(e[we]);
          return Xt(o, r);
        } else return Xt(e, t.next);
      }
    }
  }
  return null;
}
function yl(e, t) {
  if (t !== null) {
    let r = e[we][Ie],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Pi(e, t) {
  let n = ee + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[_].firstChild;
    if (o !== null) return Xt(r, o);
  }
  return t[cn];
}
function ag(e, t, n) {
  e.removeChild(null, t, n);
}
function Ps(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      c = n.type;
    if (
      (s && t === 0 && (a && lt(Ae(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) Ps(e, t, n.child, r, o, i, !1), _t(t, e, o, a, i);
      else if (c & 32) {
        let u = As(n, r),
          l;
        for (; (l = u()); ) _t(t, e, o, l, i);
        _t(t, e, o, a, i);
      } else c & 16 ? cg(e, t, r, n, o, i) : _t(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function qr(e, t, n, r, o, i) {
  Ps(n, r, e.firstChild, t, o, i, !1);
}
function cg(e, t, n, r, o, i) {
  let s = n[we],
    c = s[Ie].projection[r.projection];
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u];
      _t(t, e, o, l, i);
    }
  else {
    let u = c,
      l = s[ae];
    rl(r) && (u.flags |= 128), Ps(e, t, u, l, o, i, !0);
  }
}
function ug(e, t, n, r, o) {
  let i = n[cn],
    s = Ae(n);
  i !== s && _t(t, e, r, i, o);
  for (let a = ee; a < n.length; a++) {
    let c = n[a];
    qr(c[_], c, e, t, r, i);
  }
}
function lg(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf("-") === -1 ? void 0 : Oe.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == "string" &&
          o.endsWith("!important") &&
          ((o = o.slice(0, -10)), (i |= Oe.Important)),
        e.setStyle(n, r, o, i));
  }
}
function dg(e, t, n) {
  e.setAttribute(t, "style", n);
}
function vl(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Dl(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && wi(e, t, r),
    o !== null && vl(e, t, o),
    i !== null && dg(e, t, i);
}
function fg(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
var El = "ng-template";
function hg(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && fg(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (ks(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function ks(e) {
  return e.type === 4 && e.value !== El;
}
function pg(e, t, n) {
  let r = e.type === 4 && !n ? El : e.value;
  return t === r;
}
function gg(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? vg(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
      if (!s && !he(r) && !he(c)) return !1;
      if (s && he(c)) continue;
      (s = !1), (r = c | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !pg(e, c, n)) || (c === "" && t.length === 1))
        ) {
          if (he(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !hg(e, o, c, n)) {
          if (he(r)) return !1;
          s = !0;
        }
      } else {
        let u = t[++a],
          l = mg(c, o, ks(e), n);
        if (l === -1) {
          if (he(r)) return !1;
          s = !0;
          continue;
        }
        if (u !== "") {
          let d;
          if (
            (l > i ? (d = "") : (d = o[l + 1].toLowerCase()), r & 2 && u !== d)
          ) {
            if (he(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return he(r) || s;
}
function he(e) {
  return (e & 1) === 0;
}
function mg(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == "string"; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return Dg(t, e);
}
function yg(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (gg(e, t[r], n)) return !0;
  return !1;
}
function vg(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (hp(n)) return t;
  }
  return e.length;
}
function Dg(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function jc(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function Eg(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = "",
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      o !== "" && !he(s) && ((t += jc(i, o)), (o = "")),
        (r = s),
        (i = i || !he(r));
    n++;
  }
  return o !== "" && (t += jc(i, o)), t;
}
function wg(e) {
  return e.map(Eg).join(",");
}
function Cg(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!he(o)) break;
      o = i;
    }
    r++;
  }
  return { attrs: t, classes: n };
}
var mn = {};
function yn(e = 1) {
  wl(ce(), L(), Vt() + e, !1);
}
function wl(e, t, n, r) {
  if (!r)
    if ((t[v] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && fr(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && hr(t, i, 0, n);
    }
  ct(n);
}
function O(e, t = M.Default) {
  let n = L();
  if (n === null) return w(e, t);
  let r = be();
  return Wu(r, n, W(e), t);
}
function Cl(e, t, n, r, o, i) {
  let s = I(null);
  try {
    let a = null;
    o & We.SignalBased && (a = t[r][de]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & We.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : Du(t, a, r, i);
  } finally {
    I(s);
  }
}
function _g(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) ct(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          np(s, i);
          let c = t[i];
          a(2, c);
        }
      }
    } finally {
      ct(-1);
    }
}
function Zr(e, t, n, r, o, i, s, a, c, u, l) {
  let d = t.blueprint.slice();
  return (
    (d[Fe] = o),
    (d[v] = r | 4 | 128 | 8 | 64 | 1024),
    (u !== null || (e && e[v] & 2048)) && (d[v] |= 2048),
    _u(d),
    (d[ae] = d[Lt] = e),
    (d[$] = n),
    (d[$e] = s || (e && e[$e])),
    (d[q] = a || (e && e[q])),
    (d[Nt] = c || (e && e[Nt]) || null),
    (d[Ie] = i),
    (d[$r] = Lp()),
    (d[sn] = l),
    (d[mu] = u),
    (d[we] = t.type == 2 ? e[we] : d),
    d
  );
}
function Yr(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = Ig(e, t, n, r, o)), tp() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = Kh();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return pn(i, !0), i;
}
function Ig(e, t, n, r, o) {
  let i = Su(),
    s = Nu(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = Ng(e, a, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = c),
    i !== null &&
      (s
        ? i.child == null && c.parent !== null && (i.child = c)
        : i.next === null && ((i.next = c), (c.prev = i))),
    c
  );
}
function _l(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function Il(e, t, n, r, o) {
  let i = Vt(),
    s = r & 2;
  try {
    ct(-1), s && t.length > ge && wl(e, t, ge, !1), De(s ? 2 : 0, o), n(r, o);
  } finally {
    ct(i), De(s ? 3 : 1, o);
  }
}
function bl(e, t, n) {
  if (vu(t)) {
    let r = I(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = n[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      I(r);
    }
  }
}
function Ml(e, t, n) {
  bu() && (kg(e, t, n, ye(n, t)), (n.flags & 64) === 64 && xl(e, t, n));
}
function Tl(e, t, n = ye) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function Sl(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = Ls(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : t;
}
function Ls(e, t, n, r, o, i, s, a, c, u, l) {
  let d = ge + r,
    h = d + o,
    f = bg(d, h),
    p = typeof u == "function" ? u() : u;
  return (f[_] = {
    type: e,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: h,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: p,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function bg(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : mn);
  return n;
}
function Mg(e, t, n, r) {
  let i = r.get($p, ll) || n === Ce.ShadowDom,
    s = e.selectRootElement(t, i);
  return Tg(s), s;
}
function Tg(e) {
  Sg(e);
}
var Sg = () => null;
function Ng(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    Zh() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Bc(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    r ??= {};
    let a,
      c = We.None;
    Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
    let u = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      u = o[i];
    }
    e === 0 ? Hc(r, n, u, a, c) : Hc(r, n, u, a);
  }
  return r;
}
function Hc(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function Ag(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    a = [],
    c = null,
    u = null;
  for (let l = r; l < o; l++) {
    let d = i[l],
      h = n ? n.get(d) : null,
      f = h ? h.inputs : null,
      p = h ? h.outputs : null;
    (c = Bc(0, d.inputs, l, c, f)), (u = Bc(1, d.outputs, l, u, p));
    let g = c !== null && s !== null && !ks(t) ? qg(c, l, s) : null;
    a.push(g);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (t.flags |= 8),
    c.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = c),
    (t.outputs = u);
}
function xg(e) {
  return e === "class"
    ? "className"
    : e === "for"
    ? "htmlFor"
    : e === "formaction"
    ? "formAction"
    : e === "innerHtml"
    ? "innerHTML"
    : e === "readonly"
    ? "readOnly"
    : e === "tabindex"
    ? "tabIndex"
    : e;
}
function Og(e, t, n, r, o, i, s, a) {
  let c = ye(t, n),
    u = t.inputs,
    l;
  !a && u != null && (l = u[r])
    ? (js(e, n, l, r, o), fs(t) && Rg(n, t.index))
    : t.type & 3
    ? ((r = xg(r)),
      (o = s != null ? s(o, t.value || "", r) : o),
      i.setProperty(c, r, o))
    : t.type & 12;
}
function Rg(e, t) {
  let n = ht(t, e);
  n[v] & 16 || (n[v] |= 64);
}
function Nl(e, t, n, r) {
  if (bu()) {
    let o = r === null ? null : { "": -1 },
      i = Vg(e, n),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && Al(e, t, n, s, o, a),
      o && jg(n, r, o);
  }
  n.mergedAttrs = un(n.mergedAttrs, n.attrs);
}
function Al(e, t, n, r, o, i) {
  for (let u = 0; u < r.length; u++) Mi(Cr(n, t), e, r[u].type);
  Hg(n, e.data.length, r.length);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    c = _l(e, t, r.length, null);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    (n.mergedAttrs = un(n.mergedAttrs, l.hostAttrs)),
      Ug(e, n, t, c, l),
      Bg(c, l, o),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      c++;
  }
  Ag(e, n, i);
}
function Fg(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    Pg(s) != a && s.push(a), s.push(n, r, i);
  }
}
function Pg(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function kg(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  fs(n) && $g(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || Cr(n, t),
    lt(r, t);
  let s = n.initialInputs;
  for (let a = o; a < i; a++) {
    let c = e.data[a],
      u = Rt(t, e, a, n);
    if ((lt(u, t), s !== null && Wg(t, a - o, u, c, n, s), Ge(c))) {
      let l = ht(n.index, t);
      l[$] = Rt(t, e, a, n);
    }
  }
}
function xl(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = rp();
  try {
    ct(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        u = t[a];
      Ei(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          Lg(c, u);
    }
  } finally {
    ct(-1), Ei(s);
  }
}
function Lg(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Vg(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (yg(t, s.selectors, !1))
        if ((r || (r = []), Ge(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s);
            let c = a.length;
            ki(e, t, c);
          } else r.unshift(s), ki(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function ki(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function jg(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new E(-301, !1);
      r.push(t[o], i);
    }
  }
}
function Bg(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    Ge(t) && (n[""] = e);
  }
}
function Hg(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function Ug(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = Mt(o.type, !0)),
    s = new ut(i, Ge(o), O);
  (e.blueprint[r] = s), (n[r] = s), Fg(e, t, r, _l(e, n, o.hostVars, mn), o);
}
function Ol(e) {
  let t = 16;
  return e.signals ? (t = 4096) : e.onPush && (t = 64), t;
}
function $g(e, t, n) {
  let r = ye(t, e),
    o = Sl(n),
    i = e[$e].rendererFactory,
    s = Vs(
      e,
      Zr(
        e,
        o,
        null,
        Ol(n),
        r,
        t,
        null,
        i.createRenderer(r, n),
        null,
        null,
        null
      )
    );
  e[t.index] = s;
}
function Gg(e, t, n, r, o, i) {
  let s = ye(e, t);
  zg(t[q], s, i, e.value, n, r, o);
}
function zg(e, t, n, r, o, i, s) {
  if (i == null) e.removeAttribute(t, o, n);
  else {
    let a = s == null ? ou(i) : s(i, r || "", o);
    e.setAttribute(t, o, a, n);
  }
}
function Wg(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        u = s[a++],
        l = s[a++],
        d = s[a++];
      Cl(r, n, c, u, l, d);
    }
}
function qg(e, t, n) {
  let r = null,
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (i === 0) {
      o += 4;
      continue;
    } else if (i === 5) {
      o += 2;
      continue;
    }
    if (typeof i == "number") break;
    if (e.hasOwnProperty(i)) {
      r === null && (r = []);
      let s = e[i];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          r.push(i, s[a + 1], s[a + 2], n[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return r;
}
function Zg(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function Rl(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = I(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          xu(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      I(r);
    }
  }
}
function Vs(e, t) {
  return e[an] ? (e[_c][pe] = t) : (e[an] = t), (e[_c] = t), t;
}
function Li(e, t, n) {
  xu(0);
  let r = I(null);
  try {
    t(e, n);
  } finally {
    I(r);
  }
}
function Yg(e) {
  return (e[vr] ??= []);
}
function Qg(e) {
  return (e.cleanup ??= []);
}
function Fl(e, t) {
  let n = e[Nt],
    r = n ? n.get(ze, null) : null;
  r && r.handleError(t);
}
function js(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      c = n[i++],
      u = t[s],
      l = e.data[s];
    Cl(l, u, r, a, c, o);
  }
}
function Kg(e, t) {
  let n = ht(t, e),
    r = n[_];
  Jg(r, n);
  let o = n[Fe];
  o !== null && n[sn] === null && (n[sn] = Ss(o, n[Nt])), Bs(r, n, n[$]);
}
function Jg(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Bs(e, t, n) {
  ys(t);
  try {
    let r = e.viewQuery;
    r !== null && Li(1, r, n);
    let o = e.template;
    o !== null && Il(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[xt]?.finishViewCreation(e),
      e.staticContentQueries && Rl(e, t),
      e.staticViewQueries && Li(2, e.viewQuery, n);
    let i = e.components;
    i !== null && Xg(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[v] &= -5), vs();
  }
}
function Xg(e, t) {
  for (let n = 0; n < t.length; n++) Kg(e, t[n]);
}
function Hs(e, t, n, r) {
  let o = I(null);
  try {
    let i = t.tView,
      a = e[v] & 4096 ? 4096 : 16,
      c = Zr(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null
      ),
      u = e[t.index];
    c[At] = u;
    let l = e[xt];
    return l !== null && (c[xt] = l.createEmbeddedView(i)), Bs(i, c, n), c;
  } finally {
    I(o);
  }
}
function Pl(e, t) {
  let n = ee + t;
  if (n < e.length) return e[n];
}
function Us(e, t) {
  return !t || t.firstChild === null || rl(e);
}
function $s(e, t, n, r = !0) {
  let o = t[_];
  if ((Jp(o, t, e, n), r)) {
    let s = Pi(n, e),
      a = t[q],
      c = rg(a, e[cn]);
    c !== null && Qp(o, e[Ie], a, t, c, s);
  }
  let i = t[sn];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function kl(e, t) {
  let n = Os(e, t);
  return n !== void 0 && Rs(n[_], n), n;
}
function Tr(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(Ae(i)), ft(i) && em(i, r);
    let s = n.type;
    if (s & 8) Tr(e, t, n.child, r);
    else if (s & 32) {
      let a = As(n, t),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = yl(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = at(t[we]);
        Tr(c[_], c, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function em(e, t) {
  for (let n = ee; n < e.length; n++) {
    let r = e[n],
      o = r[_].firstChild;
    o !== null && Tr(r[_], r, o, t);
  }
  e[cn] !== e[Fe] && t.push(e[cn]);
}
var Ll = [];
function tm(e) {
  return e[ne] ?? nm(e);
}
function nm(e) {
  let t = Ll.pop() ?? Object.create(om);
  return (t.lView = e), t;
}
function rm(e) {
  e.lView[ne] !== e && ((e.lView = null), Ll.push(e));
}
var om = P(N({}, Zt), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    zr(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[ne] = this;
  },
});
function im(e) {
  let t = e[ne] ?? Object.create(sm);
  return (t.lView = e), t;
}
var sm = P(N({}, Zt), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    let t = at(e.lView);
    for (; t && !Vl(t[_]); ) t = at(t);
    t && ms(t);
  },
  consumerOnSignalRead() {
    this.lView[ne] = this;
  },
});
function Vl(e) {
  return e.type !== 2;
}
function jl(e) {
  if (e[Dr] === null) return;
  let t = !0;
  for (; t; ) {
    let n = !1;
    for (let r of e[Dr])
      r.dirty &&
        ((n = !0),
        r.zone === null || Zone.current === r.zone
          ? r.run()
          : r.zone.run(() => r.run()));
    t = n && !!(e[v] & 8192);
  }
}
var am = 100;
function Bl(e, t = !0, n = 0) {
  let o = e[$e].rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    cm(e, n);
  } catch (s) {
    throw (t && Fl(e, s), s);
  } finally {
    i || o.end?.();
  }
}
function cm(e, t) {
  let n = Au();
  try {
    bc(!0), Vi(e, t);
    let r = 0;
    for (; Gr(e); ) {
      if (r === am) throw new E(103, !1);
      r++, Vi(e, 1);
    }
  } finally {
    bc(n);
  }
}
function um(e, t, n, r) {
  let o = t[v];
  if ((o & 256) === 256) return;
  let i = !1,
    s = !1;
  ys(t);
  let a = !0,
    c = null,
    u = null;
  i ||
    (Vl(e)
      ? ((u = tm(t)), (c = Bn(u)))
      : Na() === null
      ? ((a = !1), (u = im(t)), (c = Bn(u)))
      : t[ne] && (Vo(t[ne]), (t[ne] = null)));
  try {
    _u(t), Xh(e.bindingStartIndex), n !== null && Il(e, t, n, 2, r);
    let l = (o & 3) === 3;
    if (!i)
      if (l) {
        let f = e.preOrderCheckHooks;
        f !== null && fr(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && hr(t, f, 0, null), ni(t, 0);
      }
    if (
      (s || lm(t), jl(t), Hl(t, 0), e.contentQueries !== null && Rl(e, t), !i)
    )
      if (l) {
        let f = e.contentCheckHooks;
        f !== null && fr(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && hr(t, f, 1), ni(t, 1);
      }
    _g(e, t);
    let d = e.components;
    d !== null && $l(t, d, 0);
    let h = e.viewQuery;
    if ((h !== null && Li(2, h, r), !i))
      if (l) {
        let f = e.viewCheckHooks;
        f !== null && fr(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && hr(t, f, 2), ni(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[ti])) {
      for (let f of t[ti]) f();
      t[ti] = null;
    }
    i || (t[v] &= -73);
  } catch (l) {
    throw (i || zr(t), l);
  } finally {
    u !== null && (ko(u, c), a && rm(u)), vs();
  }
}
function Hl(e, t) {
  for (let n = sl(e); n !== null; n = al(n))
    for (let r = ee; r < n.length; r++) {
      let o = n[r];
      Ul(o, t);
    }
}
function lm(e) {
  for (let t = sl(e); t !== null; t = al(t)) {
    if (!(t[v] & wr.HasTransplantedViews)) continue;
    let n = t[Er];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      ms(o);
    }
  }
}
function dm(e, t, n) {
  let r = ht(t, e);
  Ul(r, n);
}
function Ul(e, t) {
  gs(e) && Vi(e, t);
}
function Vi(e, t) {
  let r = e[_],
    o = e[v],
    i = e[ne],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Lo(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[v] &= -9217),
    s)
  )
    um(r, e, r.template, e[$]);
  else if (o & 8192) {
    jl(e), Hl(e, 1);
    let a = r.components;
    a !== null && $l(e, a, 1);
  }
}
function $l(e, t, n) {
  for (let r = 0; r < t.length; r++) dm(e, t[r], n);
}
function Gs(e, t) {
  let n = Au() ? 64 : 1088;
  for (e[$e].changeDetectionScheduler?.notify(t); e; ) {
    e[v] |= n;
    let r = at(e);
    if (mi(e) && !r) return e;
    e = r;
  }
  return null;
}
var ji = class {
  _lView;
  _cdRefInjectingView;
  notifyErrorHandler;
  _appRef = null;
  _attachedToViewContainer = !1;
  get rootNodes() {
    let t = this._lView,
      n = t[_];
    return Tr(n, t, n.firstChild, []);
  }
  constructor(t, n, r = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r);
  }
  get context() {
    return this._lView[$];
  }
  get dirty() {
    return !!(this._lView[v] & 9280) || !!this._lView[ne]?.dirty;
  }
  set context(t) {
    this._lView[$] = t;
  }
  get destroyed() {
    return (this._lView[v] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[ae];
      if (ft(t)) {
        let n = t[kh],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (Os(t, r), au(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    Rs(this._lView[_], this._lView);
  }
  onDestroy(t) {
    Iu(this._lView, t);
  }
  markForCheck() {
    Gs(this._cdRefInjectingView || this._lView, 4);
  }
  markForRefresh() {
    ms(this._cdRefInjectingView || this._lView);
  }
  detach() {
    this._lView[v] &= -129;
  }
  reattach() {
    vi(this._lView), (this._lView[v] |= 128);
  }
  detectChanges() {
    (this._lView[v] |= 1024), Bl(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new E(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = mi(this._lView),
      n = this._lView[At];
    n !== null && !t && xs(n, this._lView), pl(this._lView[_], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new E(902, !1);
    this._appRef = t;
    let n = mi(this._lView),
      r = this._lView[At];
    r !== null && !n && gl(r, this._lView), vi(this._lView);
  }
};
var g_ = new RegExp(`^(\\d+)*(${Up}|${Hp})*(.*)`);
var fm = () => null;
function zs(e, t) {
  return fm(e, t);
}
var Bi = class {},
  Sr = class {},
  Hi = class {
    resolveComponentFactory(t) {
      throw Error(`No component factory found for ${X(t)}.`);
    }
  },
  Ft = class {
    static NULL = new Hi();
  },
  Pt = class {},
  vn = (() => {
    class e {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => hm();
    }
    return e;
  })();
function hm() {
  let e = L(),
    t = be(),
    n = ht(t.index, e);
  return (Ue(n) ? n : e)[q];
}
var pm = (() => {
  class e {
    static ɵprov = S({ token: e, providedIn: "root", factory: () => null });
  }
  return e;
})();
function Ui(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = yc(o, a);
      else if (i == 2) {
        let c = a,
          u = t[++s];
        r = yc(r, c + ": " + u + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var Nr = class extends Ft {
  ngModule;
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = Br(t);
    return new $i(n, this.ngModule);
  }
};
function Uc(e, t) {
  let n = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let o = e[r];
    if (o === void 0) continue;
    let i = Array.isArray(o),
      s = i ? o[0] : o,
      a = i ? o[1] : We.None;
    t
      ? n.push({
          propName: s,
          templateName: r,
          isSignal: (a & We.SignalBased) !== 0,
        })
      : n.push({ propName: s, templateName: r });
  }
  return n;
}
function gm(e) {
  let t = e.toLowerCase();
  return t === "svg" ? Bh : t === "math" ? Hh : null;
}
var $i = class extends Sr {
    componentDef;
    ngModule;
    selector;
    componentType;
    ngContentSelectors;
    isBoundToModule;
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = Uc(t.inputs, !0);
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
      return r;
    }
    get outputs() {
      return Uc(this.componentDef.outputs, !1);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = wg(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, o) {
      let i = I(null);
      try {
        o = o || this.ngModule;
        let s = o instanceof Ne ? o : o?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new Ci(t, s) : t,
          c = a.get(Pt, null);
        if (c === null) throw new E(407, !1);
        let u = a.get(pm, null),
          l = a.get(ln, null),
          d = { rendererFactory: c, sanitizer: u, changeDetectionScheduler: l },
          h = c.createRenderer(null, this.componentDef),
          f = this.componentDef.selectors[0][0] || "div",
          p = r
            ? Mg(h, r, this.componentDef.encapsulation, a)
            : hl(h, f, gm(f)),
          g = 512;
        this.componentDef.signals
          ? (g |= 4096)
          : this.componentDef.onPush || (g |= 16);
        let y = null;
        p !== null && (y = Ss(p, a, !0));
        let C = Ls(0, null, null, 1, 0, null, null, null, null, null, null),
          R = Zr(null, C, null, g, null, null, d, h, a, null, y);
        ys(R);
        let A,
          U,
          Z = null;
        try {
          let B = this.componentDef,
            Te,
            So = null;
          B.findHostDirectiveDefs
            ? ((Te = []),
              (So = new Map()),
              B.findHostDirectiveDefs(B, Te, So),
              Te.push(B))
            : (Te = [B]);
          let vf = mm(R, p);
          (Z = ym(vf, p, B, Te, R, d, h)),
            (U = ps(C, ge)),
            p && Em(h, B, p, r),
            n !== void 0 && wm(U, this.ngContentSelectors, n),
            (A = Dm(Z, B, Te, So, R, [Cm])),
            Bs(C, R, null);
        } catch (B) {
          throw (Z !== null && xi(Z), xi(R), B);
        } finally {
          vs();
        }
        return new Gi(this.componentType, A, nl(U, R), R, U);
      } finally {
        I(i);
      }
    }
  },
  Gi = class extends Bi {
    location;
    _rootLView;
    _tNode;
    instance;
    hostView;
    changeDetectorRef;
    componentType;
    previousInputValues = null;
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new ji(o, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        o;
      if (r !== null && (o = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return;
        let i = this._rootLView;
        js(i[_], i, o, t, n), this.previousInputValues.set(t, n);
        let s = ht(this._tNode.index, i);
        Gs(s, 1);
      }
    }
    get injector() {
      return new _r(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function mm(e, t) {
  let n = e[_],
    r = ge;
  return (e[r] = t), Yr(n, r, 2, "#host", null);
}
function ym(e, t, n, r, o, i, s) {
  let a = o[_];
  vm(r, e, t, s);
  let c = null;
  t !== null && (c = Ss(t, o[Nt]));
  let u = i.rendererFactory.createRenderer(t, n),
    l = Zr(o, Sl(n), null, Ol(n), o[e.index], e, i, u, null, null, c);
  return (
    a.firstCreatePass && ki(a, e, r.length - 1), Vs(o, l), (o[e.index] = l)
  );
}
function vm(e, t, n, r) {
  for (let o of e) t.mergedAttrs = un(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (Ui(t, t.mergedAttrs, !0), n !== null && Dl(r, n, t));
}
function Dm(e, t, n, r, o, i) {
  let s = be(),
    a = o[_],
    c = ye(s, o);
  Al(a, o, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      h = Rt(o, a, d, s);
    lt(h, o);
  }
  xl(a, o, s), c && lt(c, o);
  let u = Rt(o, a, s.directiveStart + s.componentOffset, s);
  if (((e[$] = o[$] = u), i !== null)) for (let l of i) l(u, t);
  return bl(a, s, o), u;
}
function Em(e, t, n, r) {
  if (r) wi(e, n, ["ng-version", "19.0.5"]);
  else {
    let { attrs: o, classes: i } = Cg(t.selectors[0]);
    o && wi(e, n, o), i && i.length > 0 && vl(e, n, i.join(" "));
  }
}
function wm(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
function Cm() {
  let e = be();
  ws(L()[_], e);
}
var _m = () => !1;
function Im(e, t, n) {
  return _m(e, t, n);
}
function Dn(e, t) {
  pt("NgSignals");
  let n = ja(e),
    r = n[de];
  return (
    t?.equal && (r.equal = t.equal),
    (n.set = (o) => jo(r, o)),
    (n.update = (o) => Ba(r, o)),
    (n.asReadonly = bm.bind(n)),
    n
  );
}
function bm() {
  let e = this[de];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    (t[de] = e), (e.readonlyFn = t);
  }
  return e.readonlyFn;
}
function Mm(e) {
  let t = [],
    n = new Map();
  function r(o) {
    let i = n.get(o);
    if (!i) {
      let s = e(o);
      n.set(o, (i = s.then(Am)));
    }
    return i;
  }
  return (
    Ar.forEach((o, i) => {
      let s = [];
      o.templateUrl &&
        s.push(
          r(o.templateUrl).then((u) => {
            o.template = u;
          })
        );
      let a = typeof o.styles == "string" ? [o.styles] : o.styles || [];
      if (((o.styles = a), o.styleUrl && o.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
        );
      if (o.styleUrls?.length) {
        let u = o.styles.length,
          l = o.styleUrls;
        o.styleUrls.forEach((d, h) => {
          a.push(""),
            s.push(
              r(d).then((f) => {
                (a[u + h] = f),
                  l.splice(l.indexOf(d), 1),
                  l.length == 0 && (o.styleUrls = void 0);
              })
            );
        });
      } else
        o.styleUrl &&
          s.push(
            r(o.styleUrl).then((u) => {
              a.push(u), (o.styleUrl = void 0);
            })
          );
      let c = Promise.all(s).then(() => xm(i));
      t.push(c);
    }),
    Sm(),
    Promise.all(t).then(() => {})
  );
}
var Ar = new Map(),
  Tm = new Set();
function Sm() {
  let e = Ar;
  return (Ar = new Map()), e;
}
function Nm() {
  return Ar.size === 0;
}
function Am(e) {
  return typeof e == "string" ? e : e.text();
}
function xm(e) {
  Tm.delete(e);
}
var qe = class {},
  zi = class {};
var xr = class extends qe {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new Nr(this);
    constructor(t, n, r, o = !0) {
      super(), (this.ngModuleType = t), (this._parent = n);
      let i = wh(t);
      (this._bootstrapComponents = Wp(i.bootstrap)),
        (this._r3Injector = Yu(
          t,
          n,
          [
            { provide: qe, useValue: this },
            { provide: Ft, useValue: this.componentFactoryResolver },
            ...r,
          ],
          X(t),
          new Set(["environment"])
        )),
        o && this.resolveInjectorInitializers();
    }
    resolveInjectorInitializers() {
      this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  Wi = class extends zi {
    moduleType;
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new xr(this.moduleType, t, []);
    }
  };
function Om(e, t, n) {
  return new xr(e, t, n, !1);
}
var qi = class extends qe {
  injector;
  componentFactoryResolver = new Nr(this);
  instance = null;
  constructor(t) {
    super();
    let n = new on(
      [
        ...t.providers,
        { provide: qe, useValue: this },
        { provide: Ft, useValue: this.componentFactoryResolver },
      ],
      t.parent || ds(),
      t.debugName,
      new Set(["environment"])
    );
    (this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function Rm(e, t, n = null) {
  return new qi({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var Fm = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(n) {
      this._injector = n;
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = fu(!1, n.type),
          o =
            r.length > 0
              ? Rm([r], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = S({
      token: e,
      providedIn: "environment",
      factory: () => new e(w(Ne)),
    });
  }
  return e;
})();
function Gl(e) {
  return Vr(() => {
    let t = zl(e),
      n = P(N({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === ol.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: t.standalone
          ? (o) => o.get(Fm).getOrCreateStandaloneInjector(n)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Ce.Emulated,
        styles: e.styles || se,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    t.standalone && pt("NgStandalone"), Wl(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = Gc(r, !1)), (n.pipeDefs = Gc(r, !0)), (n.id = Lm(n)), n
    );
  });
}
function Pm(e) {
  return Br(e) || lu(e);
}
function km(e) {
  return e !== null;
}
function ve(e) {
  return Vr(() => ({
    type: e.type,
    bootstrap: e.bootstrap || se,
    declarations: e.declarations || se,
    imports: e.imports || se,
    exports: e.exports || se,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function $c(e, t) {
  if (e == null) return Tt;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a = We.None;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = a !== We.None ? [r, a] : r), (t[i] = s)) : (n[i] = r);
    }
  return n;
}
function G(e) {
  return Vr(() => {
    let t = zl(e);
    return Wl(t), t;
  });
}
function zl(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || Tt,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || se,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: $c(e.inputs, t),
    outputs: $c(e.outputs),
    debugInfo: null,
  };
}
function Wl(e) {
  e.features?.forEach((t) => t(e));
}
function Gc(e, t) {
  if (!e) return null;
  let n = t ? du : Pm;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(km);
}
function Lm(e) {
  let t = 0,
    n = typeof e.consts == "function" ? "" : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      n,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let i of r.join("|")) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function Vm(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function re(e) {
  let t = Vm(e.type),
    n = !0,
    r = [e];
  for (; t; ) {
    let o;
    if (Ge(e)) o = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new E(903, !1);
      o = t.ɵdir;
    }
    if (o) {
      if (n) {
        r.push(o);
        let s = e;
        (s.inputs = cr(e.inputs)),
          (s.inputTransforms = cr(e.inputTransforms)),
          (s.declaredInputs = cr(e.declaredInputs)),
          (s.outputs = cr(e.outputs));
        let a = o.hostBindings;
        a && $m(e, a);
        let c = o.viewQuery,
          u = o.contentQueries;
        if (
          (c && Hm(e, c),
          u && Um(e, u),
          jm(e, o),
          Kf(e.outputs, o.outputs),
          Ge(o) && o.data.animation)
        ) {
          let l = e.data;
          l.animation = (l.animation || []).concat(o.data.animation);
        }
      }
      let i = o.features;
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s];
          a && a.ngInherit && a(e), a === re && (n = !1);
        }
    }
    t = Object.getPrototypeOf(t);
  }
  Bm(r);
}
function jm(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
    let r = t.inputs[n];
    if (
      r !== void 0 &&
      ((e.inputs[n] = r),
      (e.declaredInputs[n] = t.declaredInputs[n]),
      t.inputTransforms !== null)
    ) {
      let o = Array.isArray(r) ? r[0] : r;
      if (!t.inputTransforms.hasOwnProperty(o)) continue;
      (e.inputTransforms ??= {}), (e.inputTransforms[o] = t.inputTransforms[o]);
    }
  }
}
function Bm(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    (o.hostVars = t += o.hostVars),
      (o.hostAttrs = un(o.hostAttrs, (n = un(n, o.hostAttrs))));
  }
}
function cr(e) {
  return e === Tt ? {} : e === se ? [] : e;
}
function Hm(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.viewQuery = t);
}
function Um(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i);
      })
    : (e.contentQueries = t);
}
function $m(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.hostBindings = t);
}
function En(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function Gm(e) {
  return (e.flags & 32) === 32;
}
function zm(e, t, n, r, o, i, s, a, c) {
  let u = t.consts,
    l = Yr(t, e, 4, s || null, a || null);
  Nl(t, n, l, Ot(u, c)), ws(t, l);
  let d = (l.tView = Ls(
    2,
    l,
    r,
    o,
    i,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    u,
    null
  ));
  return (
    t.queries !== null &&
      (t.queries.template(t, l), (d.queries = t.queries.embeddedTView(l))),
    l
  );
}
function Zi(e, t, n, r, o, i, s, a, c, u) {
  let l = n + ge,
    d = t.firstCreatePass ? zm(l, t, e, r, o, i, s, a, c) : t.data[l];
  pn(d, !1);
  let h = Wm(t, e, d, n);
  Ds() && Fs(t, e, h, d), lt(h, e);
  let f = Zg(h, e, h, d);
  return (
    (e[l] = f),
    Vs(e, f),
    Im(f, d, e),
    hs(d) && Ml(t, e, d),
    c != null && Tl(e, d, u),
    d
  );
}
function Ws(e, t, n, r, o, i, s, a) {
  let c = L(),
    u = ce(),
    l = Ot(u.consts, i);
  return Zi(c, u, e, t, n, r, o, l, s, a), Ws;
}
var Wm = qm;
function qm(e, t, n, r) {
  return Es(!0), t[q].createComment("");
}
var qs = new m(""),
  wn = new m(""),
  Qr = (() => {
    class e {
      _ngZone;
      registry;
      _isZoneStable = !0;
      _callbacks = [];
      taskTrackingZone = null;
      constructor(n, r, o) {
        (this._ngZone = n),
          (this.registry = r),
          Zs || (Zm(o), o.addToWindow(r)),
          this._watchAngularEvents(),
          n.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                F.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      isStable() {
        return this._isZoneStable && !this._ngZone.hasPendingMacrotasks;
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let n = this._callbacks.pop();
              clearTimeout(n.timeoutId), n.doneCb();
            }
          });
        else {
          let n = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((r) =>
            r.updateCb && r.updateCb(n) ? (clearTimeout(r.timeoutId), !1) : !0
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((n) => ({
              source: n.source,
              creationLocation: n.creationLocation,
              data: n.data,
            }))
          : [];
      }
      addCallback(n, r, o) {
        let i = -1;
        r &&
          r > 0 &&
          (i = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (s) => s.timeoutId !== i
            )),
              n();
          }, r)),
          this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
      }
      whenStable(n, r, o) {
        if (o && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(n, r, o), this._runCallbacksIfReady();
      }
      registerApplication(n) {
        this.registry.registerApplication(n, this);
      }
      unregisterApplication(n) {
        this.registry.unregisterApplication(n);
      }
      findProviders(n, r, o) {
        return [];
      }
      static ɵfac = function (r) {
        return new (r || e)(w(F), w(Kr), w(wn));
      };
      static ɵprov = S({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Kr = (() => {
    class e {
      _applications = new Map();
      registerApplication(n, r) {
        this._applications.set(n, r);
      }
      unregisterApplication(n) {
        this._applications.delete(n);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(n) {
        return this._applications.get(n) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(n, r = !0) {
        return Zs?.findTestabilityInTree(this, n, r) ?? null;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = S({ token: e, factory: e.ɵfac, providedIn: "platform" });
    }
    return e;
  })();
function Zm(e) {
  Zs = e;
}
var Zs;
function Cn(e) {
  return !!e && typeof e.then == "function";
}
function ql(e) {
  return !!e && typeof e.subscribe == "function";
}
var Ym = new m("");
var Zl = (() => {
    class e {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((n, r) => {
        (this.resolve = n), (this.reject = r);
      });
      appInits = D(Ym, { optional: !0 }) ?? [];
      injector = D(xe);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = Ur(this.injector, o);
          if (Cn(i)) n.push(i);
          else if (ql(i)) {
            let s = new Promise((a, c) => {
              i.subscribe({ complete: a, error: c });
            });
            n.push(s);
          }
        }
        let r = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && r(),
          (this.initialized = !0);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = S({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Qm = (() => {
    class e {
      static ɵprov = S({
        token: e,
        providedIn: "root",
        factory: () => new Yi(),
      });
    }
    return e;
  })(),
  Yi = class {
    queuedEffectCount = 0;
    queues = new Map();
    schedule(t) {
      this.enqueue(t);
    }
    enqueue(t) {
      let n = t.zone;
      this.queues.has(n) || this.queues.set(n, new Set());
      let r = this.queues.get(n);
      r.has(t) || (this.queuedEffectCount++, r.add(t));
    }
    flush() {
      for (; this.queuedEffectCount > 0; )
        for (let [t, n] of this.queues)
          t === null ? this.flushQueue(n) : t.run(() => this.flushQueue(n));
    }
    flushQueue(t) {
      for (let n of t) t.delete(n), this.queuedEffectCount--, n.run();
    }
  },
  Yl = new m("");
function Km() {
  Va(() => {
    throw new E(600, !1);
  });
}
function Jm(e) {
  return e.isBoundToModule;
}
var Xm = 10;
function ey(e, t, n) {
  try {
    let r = n();
    return Cn(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
function Ql(e, t) {
  return Array.isArray(t) ? t.reduce(Ql, e) : N(N({}, e), t);
}
var Ze = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = D(Fp);
    afterRenderManager = D(Gp);
    zonelessEnabled = D(Cs);
    rootEffectScheduler = D(Qm);
    dirtyFlags = 0;
    deferredDirtyFlags = 0;
    tracingSnapshot = null;
    externalTestViews = new Set();
    afterTick = new Se();
    get allViews() {
      return [...this.externalTestViews.keys(), ...this._views];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    isStable = D(jt).hasPendingTasks.pipe(J((n) => !n));
    constructor() {
      D(fl, { optional: !0 });
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    _injector = D(Ne);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      let o = n instanceof Sr;
      if (!this._injector.get(Zl).done) {
        let h = !o && Ch(n),
          f = !1;
        throw new E(405, f);
      }
      let s;
      o ? (s = n) : (s = this._injector.get(Ft).resolveComponentFactory(n)),
        this.componentTypes.push(s.componentType);
      let a = Jm(s) ? void 0 : this._injector.get(qe),
        c = r || s.selector,
        u = s.create(xe.NULL, [], c, a),
        l = u.location.nativeElement,
        d = u.injector.get(qs, null);
      return (
        d?.registerApplication(l),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            pr(this.components, u),
            d?.unregisterApplication(l);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
    }
    _tick = () => {
      if (this.tracingSnapshot !== null) {
        let r = this.tracingSnapshot;
        (this.tracingSnapshot = null),
          r.run(dl.CHANGE_DETECTION, this._tick),
          r.dispose();
        return;
      }
      if (this._runningTick) throw new E(101, !1);
      let n = I(null);
      try {
        (this._runningTick = !0), this.synchronize();
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        (this._runningTick = !1), I(n), this.afterTick.next();
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(Pt, null, {
          optional: !0,
        })),
        (this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0);
      let n = 0;
      for (; this.dirtyFlags !== 0 && n++ < Xm; ) this.synchronizeOnce();
    }
    synchronizeOnce() {
      if (
        ((this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0),
        this.dirtyFlags & 16 &&
          ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush()),
        this.dirtyFlags & 7)
      ) {
        let n = !!(this.dirtyFlags & 1);
        (this.dirtyFlags &= -8), (this.dirtyFlags |= 8);
        for (let { _lView: r, notifyErrorHandler: o } of this.allViews)
          ty(r, o, n, this.zonelessEnabled);
        if (
          ((this.dirtyFlags &= -5),
          this.syncDirtyFlagsWithViews(),
          this.dirtyFlags & 23)
        )
          return;
      } else this._rendererFactory?.begin?.(), this._rendererFactory?.end?.();
      this.dirtyFlags & 8 &&
        ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews();
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => Gr(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      this._views.push(r), r.attachToAppRef(this);
    }
    detachView(n) {
      let r = n;
      pr(this._views, r), r.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView),
        this.tick(),
        this.components.push(n),
        this._injector.get(Yl, []).forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => pr(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new E(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = S({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function pr(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function ty(e, t, n, r) {
  if (!n && !Gr(e)) return;
  Bl(e, t, n && !r ? 0 : 1);
}
function Ys(e, t, n, r) {
  let o = L(),
    i = Wr();
  if (En(o, i, t)) {
    let s = ce(),
      a = Lu();
    Gg(a, o, e, t, n, r);
  }
  return Ys;
}
function ur(e, t) {
  return (e << 17) | (t << 2);
}
function dt(e) {
  return (e >> 17) & 32767;
}
function ny(e) {
  return (e & 2) == 2;
}
function ry(e, t) {
  return (e & 131071) | (t << 17);
}
function Qi(e) {
  return e | 2;
}
function kt(e) {
  return (e & 131068) >> 2;
}
function si(e, t) {
  return (e & -131069) | (t << 2);
}
function oy(e) {
  return (e & 1) === 1;
}
function Ki(e) {
  return e | 1;
}
function iy(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = dt(s),
    c = kt(s);
  e[r] = n;
  let u = !1,
    l;
  if (Array.isArray(n)) {
    let d = n;
    (l = d[1]), (l === null || fn(d, l) > 0) && (u = !0);
  } else l = n;
  if (o)
    if (c !== 0) {
      let h = dt(e[a + 1]);
      (e[r + 1] = ur(h, a)),
        h !== 0 && (e[h + 1] = si(e[h + 1], r)),
        (e[a + 1] = ry(e[a + 1], r));
    } else
      (e[r + 1] = ur(a, 0)), a !== 0 && (e[a + 1] = si(e[a + 1], r)), (a = r);
  else
    (e[r + 1] = ur(c, 0)),
      a === 0 ? (a = r) : (e[c + 1] = si(e[c + 1], r)),
      (c = r);
  u && (e[r + 1] = Qi(e[r + 1])),
    zc(e, l, r, !0),
    zc(e, l, r, !1),
    sy(t, l, e, r, i),
    (s = ur(a, c)),
    i ? (t.classBindings = s) : (t.styleBindings = s);
}
function sy(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == "string" &&
    fn(i, t) >= 0 &&
    (n[r + 1] = Ki(n[r + 1]));
}
function zc(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? dt(o) : kt(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let c = e[s],
      u = e[s + 1];
    ay(c, t) && ((a = !0), (e[s + 1] = r ? Ki(u) : Qi(u))),
      (s = r ? dt(u) : kt(u));
  }
  a && (e[n + 1] = r ? Qi(o) : Ki(o));
}
function ay(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == "string"
    ? fn(e, t) >= 0
    : !1;
}
function _n(e, t, n) {
  let r = L(),
    o = Wr();
  if (En(r, o, t)) {
    let i = ce(),
      s = Lu();
    Og(i, s, r, e, t, r[q], n, !1);
  }
  return _n;
}
function Wc(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? "class" : "style";
  js(e, n, i[s], s, r);
}
function Jr(e, t) {
  return cy(e, t, null, !0), Jr;
}
function cy(e, t, n, r) {
  let o = L(),
    i = ce(),
    s = ep(2);
  if ((i.firstUpdatePass && ly(i, e, s, r), t !== mn && En(o, s, t))) {
    let a = i.data[Vt()];
    gy(i, a, o, o[q], e, (o[s + 1] = my(t, n)), r, s);
  }
}
function uy(e, t) {
  return t >= e.expandoStartIndex;
}
function ly(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[Vt()],
      s = uy(e, n);
    yy(i, r) && t === null && !s && (t = !1),
      (t = dy(o, i, t, r)),
      iy(o, i, t, n, s, r);
  }
}
function dy(e, t, n, r) {
  let o = op(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = ai(null, e, t, n, r)), (n = dn(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = ai(o, e, t, n, r)), i === null)) {
        let c = fy(e, t, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = ai(null, e, t, c[1], r)),
          (c = dn(c, t.attrs, r)),
          hy(e, t, r, c));
      } else i = py(e, t, r);
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n
  );
}
function fy(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (kt(r) !== 0) return e[dt(r)];
}
function hy(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[dt(o)] = r;
}
function py(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = dn(r, s, n);
  }
  return dn(r, t.attrs, n);
}
function ai(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = dn(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return e !== null && (n.directiveStylingLast = a), r;
}
function dn(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number"
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
          Dh(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function gy(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let c = e.data,
    u = c[a + 1],
    l = oy(u) ? qc(c, t, n, o, kt(u), s) : void 0;
  if (!Or(l)) {
    Or(i) || (ny(u) && (i = qc(c, null, n, o, a, s)));
    let d = Uh(Vt(), n);
    lg(r, s, d, o, i);
  }
}
function qc(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      u = Array.isArray(c),
      l = u ? c[1] : c,
      d = l === null,
      h = n[o + 1];
    h === mn && (h = d ? se : void 0);
    let f = d ? Xo(h, r) : l === r ? h : void 0;
    if ((u && !Or(f) && (f = Xo(c, r)), Or(f) && ((a = f), s))) return a;
    let p = e[o + 1];
    o = s ? dt(p) : kt(p);
  }
  if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = Xo(c, r));
  }
  return a;
}
function Or(e) {
  return e !== void 0;
}
function my(e, t) {
  return (
    e == null ||
      e === "" ||
      (typeof t == "string"
        ? (e = e + t)
        : typeof e == "object" && (e = X(Ns(e)))),
    e
  );
}
function yy(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
var Ji = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      this.attach(r, i), this.attach(o, s);
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function ci(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function vy(e, t, n) {
  let r,
    o,
    i = 0,
    s = e.length - 1,
    a = void 0;
  if (Array.isArray(t)) {
    let c = t.length - 1;
    for (; i <= s && i <= c; ) {
      let u = e.at(i),
        l = t[i],
        d = ci(i, u, i, l, n);
      if (d !== 0) {
        d < 0 && e.updateValue(i, l), i++;
        continue;
      }
      let h = e.at(s),
        f = t[c],
        p = ci(s, h, c, f, n);
      if (p !== 0) {
        p < 0 && e.updateValue(s, f), s--, c--;
        continue;
      }
      let g = n(i, u),
        y = n(s, h),
        C = n(i, l);
      if (Object.is(C, y)) {
        let R = n(c, f);
        Object.is(R, g)
          ? (e.swap(i, s), e.updateValue(s, f), c--, s--)
          : e.move(s, i),
          e.updateValue(i, l),
          i++;
        continue;
      }
      if (((r ??= new Rr()), (o ??= Yc(e, i, s, n)), Xi(e, r, i, C)))
        e.updateValue(i, l), i++, s++;
      else if (o.has(C)) r.set(g, e.detach(i)), s--;
      else {
        let R = e.create(i, t[i]);
        e.attach(i, R), i++, s++;
      }
    }
    for (; i <= c; ) Zc(e, r, n, i, t[i]), i++;
  } else if (t != null) {
    let c = t[Symbol.iterator](),
      u = c.next();
    for (; !u.done && i <= s; ) {
      let l = e.at(i),
        d = u.value,
        h = ci(i, l, i, d, n);
      if (h !== 0) h < 0 && e.updateValue(i, d), i++, (u = c.next());
      else {
        (r ??= new Rr()), (o ??= Yc(e, i, s, n));
        let f = n(i, d);
        if (Xi(e, r, i, f)) e.updateValue(i, d), i++, s++, (u = c.next());
        else if (!o.has(f))
          e.attach(i, e.create(i, d)), i++, s++, (u = c.next());
        else {
          let p = n(i, l);
          r.set(p, e.detach(i)), s--;
        }
      }
    }
    for (; !u.done; ) Zc(e, r, n, e.length, u.value), (u = c.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((c) => {
    e.destroy(c);
  });
}
function Xi(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function Zc(e, t, n, r, o) {
  if (Xi(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function Yc(e, t, n, r) {
  let o = new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var Rr = class {
  kvMap = new Map();
  _vMap = void 0;
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) (r = o.get(r)), t(r, n);
      }
  }
};
function Kl(e, t) {
  pt("NgControlFlow");
  let n = L(),
    r = Wr(),
    o = n[r] !== mn ? n[r] : -1,
    i = o !== -1 ? Fr(n, ge + o) : void 0,
    s = 0;
  if (En(n, r, e)) {
    let a = I(null);
    try {
      if ((i !== void 0 && kl(i, s), e !== -1)) {
        let c = ge + e,
          u = Fr(n, c),
          l = rs(n[_], c),
          d = zs(u, l.tView.ssrId),
          h = Hs(n, l, t, { dehydratedView: d });
        $s(u, h, s, Us(l, d));
      }
    } finally {
      I(a);
    }
  } else if (i !== void 0) {
    let a = Pl(i, s);
    a !== void 0 && (a[$] = t);
  }
}
var es = class {
  lContainer;
  $implicit;
  $index;
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - ee;
  }
};
function Jl(e) {
  return e;
}
var ts = class {
  hasEmptyBlock;
  trackByFn;
  liveCollection;
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function Xl(e, t, n, r, o, i, s, a, c, u, l, d, h) {
  pt("NgControlFlow");
  let f = L(),
    p = ce(),
    g = c !== void 0,
    y = L(),
    C = a ? s.bind(y[we][$]) : s,
    R = new ts(g, C);
  (y[ge + e] = R),
    Zi(f, p, e + 1, t, n, r, o, Ot(p.consts, i)),
    g && Zi(f, p, e + 2, c, u, l, d, Ot(p.consts, h));
}
var ns = class extends Ji {
  lContainer;
  hostLView;
  templateTNode;
  operationsCounter = void 0;
  needsIndexUpdate = !1;
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r);
  }
  get length() {
    return this.lContainer.length - ee;
  }
  at(t) {
    return this.getLView(t)[$].$implicit;
  }
  attach(t, n) {
    let r = n[sn];
    (this.needsIndexUpdate ||= t !== this.length),
      $s(this.lContainer, n, t, Us(this.templateTNode, r));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), Dy(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = zs(this.lContainer, this.templateTNode.tView.ssrId),
      o = Hs(
        this.hostLView,
        this.templateTNode,
        new es(this.lContainer, n, t),
        { dehydratedView: r }
      );
    return this.operationsCounter?.recordCreate(), o;
  }
  destroy(t) {
    Rs(t[_], t), this.operationsCounter?.recordDestroy();
  }
  updateValue(t, n) {
    this.getLView(t)[$].$implicit = n;
  }
  reset() {
    (this.needsIndexUpdate = !1), this.operationsCounter?.reset();
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[$].$index = t;
  }
  getLView(t) {
    return Ey(this.lContainer, t);
  }
};
function ed(e) {
  let t = I(null),
    n = Vt();
  try {
    let r = L(),
      o = r[_],
      i = r[n],
      s = n + 1,
      a = Fr(r, s);
    if (i.liveCollection === void 0) {
      let u = rs(o, s);
      i.liveCollection = new ns(a, r, u);
    } else i.liveCollection.reset();
    let c = i.liveCollection;
    if ((vy(c, e, i.trackByFn), c.updateIndexes(), i.hasEmptyBlock)) {
      let u = Wr(),
        l = c.length === 0;
      if (En(r, u, l)) {
        let d = n + 2,
          h = Fr(r, d);
        if (l) {
          let f = rs(o, d),
            p = zs(h, f.tView.ssrId),
            g = Hs(r, f, void 0, { dehydratedView: p });
          $s(h, g, 0, Us(f, p));
        } else kl(h, 0);
      }
    }
  } finally {
    I(t);
  }
}
function Fr(e, t) {
  return e[t];
}
function Dy(e, t) {
  return Os(e, t);
}
function Ey(e, t) {
  return Pl(e, t);
}
function rs(e, t) {
  return ps(e, t);
}
function wy(e, t, n, r, o, i) {
  let s = t.consts,
    a = Ot(s, o),
    c = Yr(t, e, 2, r, a);
  return (
    Nl(t, n, c, Ot(s, i)),
    c.attrs !== null && Ui(c, c.attrs, !1),
    c.mergedAttrs !== null && Ui(c, c.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, c),
    c
  );
}
function V(e, t, n, r) {
  let o = L(),
    i = ce(),
    s = ge + e,
    a = o[q],
    c = i.firstCreatePass ? wy(s, i, o, t, n, r) : i.data[s],
    u = Cy(i, o, c, a, t, e);
  o[s] = u;
  let l = hs(c);
  return (
    pn(c, !0),
    Dl(a, u, c),
    !Gm(c) && Ds() && Fs(i, o, u, c),
    zh() === 0 && lt(u, o),
    Wh(),
    l && (Ml(i, o, c), bl(i, c, o)),
    r !== null && Tl(o, c),
    V
  );
}
function j() {
  let e = be();
  Nu() ? Jh() : ((e = e.parent), pn(e, !1));
  let t = e;
  Yh(t) && Qh(), qh();
  let n = ce();
  return (
    n.firstCreatePass && (ws(n, e), vu(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      dp(t) &&
      Wc(n, t, L(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      fp(t) &&
      Wc(n, t, L(), t.stylesWithoutHost, !1),
    j
  );
}
function Qe(e, t, n, r) {
  return V(e, t, n, r), j(), Qe;
}
var Cy = (e, t, n, r, o, i) => (Es(!0), hl(r, o, ap()));
function td() {
  return L();
}
var Pr = "en-US";
var _y = Pr;
function Iy(e) {
  typeof e == "string" && (_y = e.toLowerCase().replace(/_/g, "-"));
}
var by = (e, t, n) => {};
function Pe(e, t, n, r) {
  let o = L(),
    i = ce(),
    s = be();
  return Ty(i, o, o[q], s, e, t, r), Pe;
}
function My(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[vr],
          c = o[i + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (i += 2);
    }
  return null;
}
function Ty(e, t, n, r, o, i, s) {
  let a = hs(r),
    u = e.firstCreatePass && Qg(e),
    l = t[$],
    d = Yg(t),
    h = !0;
  if (r.type & 3 || s) {
    let g = ye(r, t),
      y = s ? s(g) : g,
      C = d.length,
      R = s ? (U) => s(Ae(U[r.index])) : r.index,
      A = null;
    if ((!s && a && (A = My(e, t, o, r.index)), A !== null)) {
      let U = A.__ngLastListenerFn__ || A;
      (U.__ngNextListenerFn__ = i), (A.__ngLastListenerFn__ = i), (h = !1);
    } else {
      (i = Kc(r, t, l, i)), by(g, o, i);
      let U = n.listen(y, o, i);
      d.push(i, U), u && u.push(o, R, C, C + 1);
    }
  } else i = Kc(r, t, l, i);
  let f = r.outputs,
    p;
  if (h && f !== null && (p = f[o])) {
    let g = p.length;
    if (g)
      for (let y = 0; y < g; y += 2) {
        let C = p[y],
          R = p[y + 1],
          Z = t[C][R].subscribe(i),
          B = d.length;
        d.push(i, Z), u && u.push(o, r.index, B, -(B + 1));
      }
  }
}
function Qc(e, t, n, r) {
  let o = I(null);
  try {
    return De(6, t, n), n(r) !== !1;
  } catch (i) {
    return Fl(e, i), !1;
  } finally {
    De(7, t, n), I(o);
  }
}
function Kc(e, t, n, r) {
  return function o(i) {
    if (i === Function) return r;
    let s = e.componentOffset > -1 ? ht(e.index, t) : t;
    Gs(s, 5);
    let a = Qc(t, n, r, i),
      c = o.__ngNextListenerFn__;
    for (; c; ) (a = Qc(t, n, c, i) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function Qs(e = 1) {
  return sp(e);
}
function ue(e, t = "") {
  let n = L(),
    r = ce(),
    o = e + ge,
    i = r.firstCreatePass ? Yr(r, o, 1, t, null) : r.data[o],
    s = Sy(r, n, i, t, e);
  (n[o] = s), Ds() && Fs(r, n, s, i), pn(i, !1);
}
var Sy = (e, t, n, r, o) => (Es(!0), Zp(t[q], r));
function Ny(e, t, n) {
  let r = ce();
  if (r.firstCreatePass) {
    let o = Ge(e);
    os(n, r.data, r.blueprint, o, !0), os(t, r.data, r.blueprint, o, !1);
  }
}
function os(e, t, n, r, o) {
  if (((e = W(e)), Array.isArray(e)))
    for (let i = 0; i < e.length; i++) os(e[i], t, n, r, o);
  else {
    let i = ce(),
      s = L(),
      a = be(),
      c = St(e) ? e : W(e.provide),
      u = gu(e),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      h = a.providerIndexes >> 20;
    if (St(e) || !e.multi) {
      let f = new ut(u, o, O),
        p = li(c, t, o ? l : l + h, d);
      p === -1
        ? (Mi(Cr(a, s), i, c),
          ui(i, e, t.length),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(f),
          s.push(f))
        : ((n[p] = f), (s[p] = f));
    } else {
      let f = li(c, t, l + h, d),
        p = li(c, t, l, l + h),
        g = f >= 0 && n[f],
        y = p >= 0 && n[p];
      if ((o && !y) || (!o && !g)) {
        Mi(Cr(a, s), i, c);
        let C = Oy(o ? xy : Ay, n.length, o, r, u);
        !o && y && (n[p].providerFactory = C),
          ui(i, e, t.length, 0),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(C),
          s.push(C);
      } else {
        let C = nd(n[o ? p : f], u, !o && r);
        ui(i, e, f > -1 ? f : p, C);
      }
      !o && r && y && n[p].componentProviders++;
    }
  }
}
function ui(e, t, n, r) {
  let o = St(t),
    i = Th(t);
  if (o || i) {
    let c = (i ? W(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
      let u = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let l = u.indexOf(n);
        l === -1 ? u.push(n, [r, c]) : u[l + 1].push(r, c);
      } else u.push(n, c);
    }
  }
}
function nd(e, t, n) {
  return n && e.componentProviders++, e.multi.push(t) - 1;
}
function li(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function Ay(e, t, n, r) {
  return is(this.multi, []);
}
function xy(e, t, n, r) {
  let o = this.multi,
    i;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Rt(n, n[_], this.providerFactory.index, r);
    (i = a.slice(0, s)), is(o, i);
    for (let c = s; c < a.length; c++) i.push(a[c]);
  } else (i = []), is(o, i);
  return i;
}
function is(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function Oy(e, t, n, r, o) {
  let i = new ut(e, n, O);
  return (
    (i.multi = []),
    (i.index = t),
    (i.componentProviders = 0),
    nd(i, o, r && !n),
    i
  );
}
function Ke(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => Ny(r, o ? o(e) : e, t);
  };
}
var lr = null;
function Ry(e) {
  (lr !== null &&
    (e.defaultEncapsulation !== lr.defaultEncapsulation ||
      e.preserveWhitespaces !== lr.preserveWhitespaces)) ||
    (lr = e);
}
var Fy = new m("");
function Py(e, t, n) {
  let r = new Wi(n);
  return Promise.resolve(r);
}
function Jc(e) {
  for (let t = e.length - 1; t >= 0; t--) if (e[t] !== void 0) return e[t];
}
var ky = (() => {
  class e {
    zone = D(F);
    changeDetectionScheduler = D(ln);
    applicationRef = D(Ze);
    _onMicrotaskEmptySubscription;
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.changeDetectionScheduler.runningTick ||
                this.zone.run(() => {
                  this.applicationRef.tick();
                });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = S({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function Ly({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new F(P(N({}, rd()), { scheduleInRootZone: n }))),
    [
      { provide: F, useFactory: e },
      {
        provide: rn,
        multi: !0,
        useFactory: () => {
          let r = D(ky, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: rn,
        multi: !0,
        useFactory: () => {
          let r = D(Vy);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: Ju, useValue: !0 } : [],
      { provide: Xu, useValue: n ?? Qu },
    ]
  );
}
function rd(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var Vy = (() => {
  class e {
    subscription = new z();
    initialized = !1;
    zone = D(F);
    pendingTasks = D(jt);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              F.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            F.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = S({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
var jy = (() => {
  class e {
    appRef = D(Ze);
    taskService = D(jt);
    ngZone = D(F);
    zonelessEnabled = D(Cs);
    tracing = D(fl, { optional: !0 });
    disableScheduling = D(Ju, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new z();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(br) : null;
    scheduleInRootZone =
      !this.zonelessEnabled &&
      this.zoneIsDefined &&
      (D(Xu, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          this.runningTick || this.cleanup();
        })
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          })
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof Mr || !this.zoneIsDefined));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      let r = !1;
      switch (n) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 8: {
          this.appRef.deferredDirtyFlags |= 8;
          break;
        }
        case 6: {
          (this.appRef.dirtyFlags |= 2), (r = !0);
          break;
        }
        case 13: {
          (this.appRef.dirtyFlags |= 16), (r = !0);
          break;
        }
        case 14: {
          (this.appRef.dirtyFlags |= 2), (r = !0);
          break;
        }
        case 12: {
          r = !0;
          break;
        }
        case 10:
        case 9:
        case 7:
        case 11:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick(r))
      )
        return;
      let o = this.useMicrotaskScheduler ? Oc : el;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              o(() => this.tick())
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              o(() => this.tick())
            ));
    }
    shouldScheduleTick(n) {
      return !(
        (this.disableScheduling && !n) ||
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(br + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled &&
        this.appRef.dirtyFlags & 7 &&
        (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick();
          },
          void 0,
          this.schedulerTickApplyArgs
        );
      } catch (r) {
        throw (this.taskService.remove(n), r);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        Oc(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(n);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(n);
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = S({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function By() {
  return (typeof $localize < "u" && $localize.locale) || Pr;
}
var Ks = new m("", {
  providedIn: "root",
  factory: () => D(Ks, M.Optional | M.SkipSelf) || By(),
});
var kr = new m(""),
  Hy = new m("");
function Kt(e) {
  return !e.moduleRef;
}
function Uy(e) {
  let t = Kt(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(F);
  return n.run(() => {
    Kt(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(ze, null),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({
          next: (i) => {
            r.handleError(i);
          },
        });
      }),
      Kt(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(kr);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(kr);
      s.add(i),
        e.moduleRef.onDestroy(() => {
          pr(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
    }
    return ey(r, n, () => {
      let i = t.get(Zl);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get(Ks, Pr);
          if ((Iy(s || Pr), !t.get(Hy, !0)))
            return Kt(e)
              ? t.get(Ze)
              : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
          if (Kt(e)) {
            let c = t.get(Ze);
            return (
              e.rootComponent !== void 0 && c.bootstrap(e.rootComponent), c
            );
          } else return $y(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function $y(e, t) {
  let n = e.injector.get(Ze);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new E(-403, !1);
  t.push(e);
}
var od = (() => {
    class e {
      _injector;
      _modules = [];
      _destroyListeners = [];
      _destroyed = !1;
      constructor(n) {
        this._injector = n;
      }
      bootstrapModuleFactory(n, r) {
        let o = r?.scheduleInRootZone,
          i = () =>
            Rp(
              r?.ngZone,
              P(
                N(
                  {},
                  rd({
                    eventCoalescing: r?.ngZoneEventCoalescing,
                    runCoalescing: r?.ngZoneRunCoalescing,
                  })
                ),
                { scheduleInRootZone: o }
              )
            ),
          s = r?.ignoreChangesOutsideZone,
          a = [
            Ly({ ngZoneFactory: i, ignoreChangesOutsideZone: s }),
            { provide: ln, useExisting: jy },
          ],
          c = Om(n.moduleType, this.injector, a);
        return Uy({
          moduleRef: c,
          allPlatformModules: this._modules,
          platformInjector: this.injector,
        });
      }
      bootstrapModule(n, r = []) {
        let o = Ql({}, r);
        return Py(this.injector, o, n).then((i) =>
          this.bootstrapModuleFactory(i, o)
        );
      }
      onDestroy(n) {
        this._destroyListeners.push(n);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new E(404, !1);
        this._modules.slice().forEach((r) => r.destroy()),
          this._destroyListeners.forEach((r) => r());
        let n = this._injector.get(kr, null);
        n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
      static ɵfac = function (r) {
        return new (r || e)(w(xe));
      };
      static ɵprov = S({ token: e, factory: e.ɵfac, providedIn: "platform" });
    }
    return e;
  })(),
  tn = null,
  id = new m("");
function Gy(e) {
  if (tn && !tn.get(id, !1)) throw new E(400, !1);
  Km(), (tn = e);
  let t = e.get(od);
  return qy(e), t;
}
function Js(e, t, n = []) {
  let r = `Platform: ${t}`,
    o = new m(r);
  return (i = []) => {
    let s = sd();
    if (!s || s.injector.get(id, !1)) {
      let a = [...n, ...i, { provide: o, useValue: !0 }];
      e ? e(a) : Gy(zy(a, r));
    }
    return Wy(o);
  };
}
function zy(e = [], t) {
  return xe.create({
    name: t,
    providers: [
      { provide: Hr, useValue: "platform" },
      { provide: kr, useValue: new Set([() => (tn = null)]) },
      ...e,
    ],
  });
}
function Wy(e) {
  let t = sd();
  if (!t) throw new E(401, !1);
  return t;
}
function sd() {
  return tn?.get(od) ?? null;
}
function qy(e) {
  let t = e.get(Ms, null);
  Ur(e, () => {
    t?.forEach((n) => n());
  });
}
var ad = Js(null, "core", []),
  cd = (() => {
    class e {
      constructor(n) {}
      static ɵfac = function (r) {
        return new (r || e)(w(Ze));
      };
      static ɵmod = ve({ type: e });
      static ɵinj = me({});
    }
    return e;
  })();
function In(e, t) {
  pt("NgSignals");
  let n = Pa(e);
  return t?.equal && (n[de].equal = t.equal), n;
}
function ke(e) {
  let t = I(null);
  try {
    return e();
  } finally {
    I(t);
  }
}
var Xc = class {
  [de];
  constructor(t) {
    this[de] = t;
  }
  destroy() {
    this[de].destroy();
  }
};
var dd = null;
function mt() {
  return dd;
}
function fd(e) {
  dd ??= e;
}
var Xr = class {};
var Me = new m("");
function eo(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var hd = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵmod = ve({ type: e });
      static ɵinj = me({});
    }
    return e;
  })(),
  pd = "browser",
  Yy = "server";
function to(e) {
  return e === Yy;
}
var Ht = class {};
var Mn = class {},
  ro = class {},
  Le = class e {
    headers;
    normalizedNames = new Map();
    lazyInit;
    lazyUpdate = null;
    constructor(t) {
      t
        ? typeof t == "string"
          ? (this.lazyInit = () => {
              (this.headers = new Map()),
                t
                  .split(
                    `
`
                  )
                  .forEach((n) => {
                    let r = n.indexOf(":");
                    if (r > 0) {
                      let o = n.slice(0, r),
                        i = n.slice(r + 1).trim();
                      this.addHeaderEntry(o, i);
                    }
                  });
            })
          : typeof Headers < "u" && t instanceof Headers
          ? ((this.headers = new Map()),
            t.forEach((n, r) => {
              this.addHeaderEntry(r, n);
            }))
          : (this.lazyInit = () => {
              (this.headers = new Map()),
                Object.entries(t).forEach(([n, r]) => {
                  this.setHeaderEntries(n, r);
                });
            })
        : (this.headers = new Map());
    }
    has(t) {
      return this.init(), this.headers.has(t.toLowerCase());
    }
    get(t) {
      this.init();
      let n = this.headers.get(t.toLowerCase());
      return n && n.length > 0 ? n[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(t) {
      return this.init(), this.headers.get(t.toLowerCase()) || null;
    }
    append(t, n) {
      return this.clone({ name: t, value: n, op: "a" });
    }
    set(t, n) {
      return this.clone({ name: t, value: n, op: "s" });
    }
    delete(t, n) {
      return this.clone({ name: t, value: n, op: "d" });
    }
    maybeSetNormalizedName(t, n) {
      this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof e
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
          (this.lazyUpdate = null)));
    }
    copyFrom(t) {
      t.init(),
        Array.from(t.headers.keys()).forEach((n) => {
          this.headers.set(n, t.headers.get(n)),
            this.normalizedNames.set(n, t.normalizedNames.get(n));
        });
    }
    clone(t) {
      let n = new e();
      return (
        (n.lazyInit =
          this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
        (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
        n
      );
    }
    applyUpdate(t) {
      let n = t.name.toLowerCase();
      switch (t.op) {
        case "a":
        case "s":
          let r = t.value;
          if ((typeof r == "string" && (r = [r]), r.length === 0)) return;
          this.maybeSetNormalizedName(t.name, n);
          let o = (t.op === "a" ? this.headers.get(n) : void 0) || [];
          o.push(...r), this.headers.set(n, o);
          break;
        case "d":
          let i = t.value;
          if (!i) this.headers.delete(n), this.normalizedNames.delete(n);
          else {
            let s = this.headers.get(n);
            if (!s) return;
            (s = s.filter((a) => i.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(n), this.normalizedNames.delete(n))
                : this.headers.set(n, s);
          }
          break;
      }
    }
    addHeaderEntry(t, n) {
      let r = t.toLowerCase();
      this.maybeSetNormalizedName(t, r),
        this.headers.has(r)
          ? this.headers.get(r).push(n)
          : this.headers.set(r, [n]);
    }
    setHeaderEntries(t, n) {
      let r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
        o = t.toLowerCase();
      this.headers.set(o, r), this.maybeSetNormalizedName(t, o);
    }
    forEach(t) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((n) =>
          t(this.normalizedNames.get(n), this.headers.get(n))
        );
    }
  };
var ea = class {
  encodeKey(t) {
    return gd(t);
  }
  encodeValue(t) {
    return gd(t);
  }
  decodeKey(t) {
    return decodeURIComponent(t);
  }
  decodeValue(t) {
    return decodeURIComponent(t);
  }
};
function Ky(e, t) {
  let n = new Map();
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, "")
        .split("&")
        .forEach((o) => {
          let i = o.indexOf("="),
            [s, a] =
              i == -1
                ? [t.decodeKey(o), ""]
                : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
            c = n.get(s) || [];
          c.push(a), n.set(s, c);
        }),
    n
  );
}
var Jy = /%(\d[a-f0-9])/gi,
  Xy = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function gd(e) {
  return encodeURIComponent(e).replace(Jy, (t, n) => Xy[n] ?? t);
}
function no(e) {
  return `${e}`;
}
var Xe = class e {
  map;
  encoder;
  updates = null;
  cloneFrom = null;
  constructor(t = {}) {
    if (((this.encoder = t.encoder || new ea()), t.fromString)) {
      if (t.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = Ky(t.fromString, this.encoder);
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((n) => {
            let r = t.fromObject[n],
              o = Array.isArray(r) ? r.map(no) : [no(r)];
            this.map.set(n, o);
          }))
        : (this.map = null);
  }
  has(t) {
    return this.init(), this.map.has(t);
  }
  get(t) {
    this.init();
    let n = this.map.get(t);
    return n ? n[0] : null;
  }
  getAll(t) {
    return this.init(), this.map.get(t) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(t, n) {
    return this.clone({ param: t, value: n, op: "a" });
  }
  appendAll(t) {
    let n = [];
    return (
      Object.keys(t).forEach((r) => {
        let o = t[r];
        Array.isArray(o)
          ? o.forEach((i) => {
              n.push({ param: r, value: i, op: "a" });
            })
          : n.push({ param: r, value: o, op: "a" });
      }),
      this.clone(n)
    );
  }
  set(t, n) {
    return this.clone({ param: t, value: n, op: "s" });
  }
  delete(t, n) {
    return this.clone({ param: t, value: n, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let n = this.encoder.encodeKey(t);
          return this.map
            .get(t)
            .map((r) => n + "=" + this.encoder.encodeValue(r))
            .join("&");
        })
        .filter((t) => t !== "")
        .join("&")
    );
  }
  clone(t) {
    let n = new e({ encoder: this.encoder });
    return (
      (n.cloneFrom = this.cloneFrom || this),
      (n.updates = (this.updates || []).concat(t)),
      n
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach((t) => {
          switch (t.op) {
            case "a":
            case "s":
              let n = (t.op === "a" ? this.map.get(t.param) : void 0) || [];
              n.push(no(t.value)), this.map.set(t.param, n);
              break;
            case "d":
              if (t.value !== void 0) {
                let r = this.map.get(t.param) || [],
                  o = r.indexOf(no(t.value));
                o !== -1 && r.splice(o, 1),
                  r.length > 0
                    ? this.map.set(t.param, r)
                    : this.map.delete(t.param);
              } else {
                this.map.delete(t.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var ta = class {
  map = new Map();
  set(t, n) {
    return this.map.set(t, n), this;
  }
  get(t) {
    return (
      this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
    );
  }
  delete(t) {
    return this.map.delete(t), this;
  }
  has(t) {
    return this.map.has(t);
  }
  keys() {
    return this.map.keys();
  }
};
function ev(e) {
  switch (e) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function md(e) {
  return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
}
function yd(e) {
  return typeof Blob < "u" && e instanceof Blob;
}
function vd(e) {
  return typeof FormData < "u" && e instanceof FormData;
}
function tv(e) {
  return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
}
var bn = class e {
    url;
    body = null;
    headers;
    context;
    reportProgress = !1;
    withCredentials = !1;
    responseType = "json";
    method;
    params;
    urlWithParams;
    transferCache;
    constructor(t, n, r, o) {
      (this.url = n), (this.method = t.toUpperCase());
      let i;
      if (
        (ev(this.method) || o
          ? ((this.body = r !== void 0 ? r : null), (i = o))
          : (i = r),
        i &&
          ((this.reportProgress = !!i.reportProgress),
          (this.withCredentials = !!i.withCredentials),
          i.responseType && (this.responseType = i.responseType),
          i.headers && (this.headers = i.headers),
          i.context && (this.context = i.context),
          i.params && (this.params = i.params),
          (this.transferCache = i.transferCache)),
        (this.headers ??= new Le()),
        (this.context ??= new ta()),
        !this.params)
      )
        (this.params = new Xe()), (this.urlWithParams = n);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = n;
        else {
          let a = n.indexOf("?"),
            c = a === -1 ? "?" : a < n.length - 1 ? "&" : "";
          this.urlWithParams = n + c + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == "string" ||
          md(this.body) ||
          yd(this.body) ||
          vd(this.body) ||
          tv(this.body)
        ? this.body
        : this.body instanceof Xe
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || vd(this.body)
        ? null
        : yd(this.body)
        ? this.body.type || null
        : md(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof Xe
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(t = {}) {
      let n = t.method || this.method,
        r = t.url || this.url,
        o = t.responseType || this.responseType,
        i = t.transferCache ?? this.transferCache,
        s = t.body !== void 0 ? t.body : this.body,
        a = t.withCredentials ?? this.withCredentials,
        c = t.reportProgress ?? this.reportProgress,
        u = t.headers || this.headers,
        l = t.params || this.params,
        d = t.context ?? this.context;
      return (
        t.setHeaders !== void 0 &&
          (u = Object.keys(t.setHeaders).reduce(
            (h, f) => h.set(f, t.setHeaders[f]),
            u
          )),
        t.setParams &&
          (l = Object.keys(t.setParams).reduce(
            (h, f) => h.set(f, t.setParams[f]),
            l
          )),
        new e(n, r, s, {
          params: l,
          headers: u,
          context: d,
          reportProgress: c,
          responseType: o,
          withCredentials: a,
          transferCache: i,
        })
      );
    }
  },
  et = (function (e) {
    return (
      (e[(e.Sent = 0)] = "Sent"),
      (e[(e.UploadProgress = 1)] = "UploadProgress"),
      (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
      (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
      (e[(e.Response = 4)] = "Response"),
      (e[(e.User = 5)] = "User"),
      e
    );
  })(et || {}),
  Tn = class {
    headers;
    status;
    statusText;
    url;
    ok;
    type;
    constructor(t, n = 200, r = "OK") {
      (this.headers = t.headers || new Le()),
        (this.status = t.status !== void 0 ? t.status : n),
        (this.statusText = t.statusText || r),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  oo = class e extends Tn {
    constructor(t = {}) {
      super(t);
    }
    type = et.ResponseHeader;
    clone(t = {}) {
      return new e({
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  Sn = class e extends Tn {
    body;
    constructor(t = {}) {
      super(t), (this.body = t.body !== void 0 ? t.body : null);
    }
    type = et.Response;
    clone(t = {}) {
      return new e({
        body: t.body !== void 0 ? t.body : this.body,
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  Je = class extends Tn {
    name = "HttpErrorResponse";
    message;
    error;
    ok = !1;
    constructor(t) {
      super(t, 0, "Unknown Error"),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              t.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              t.url || "(unknown url)"
            }: ${t.status} ${t.statusText}`),
        (this.error = t.error || null);
    }
  },
  Cd = 200,
  nv = 204;
function Xs(e, t) {
  return {
    body: t,
    headers: e.headers,
    context: e.context,
    observe: e.observe,
    params: e.params,
    reportProgress: e.reportProgress,
    responseType: e.responseType,
    withCredentials: e.withCredentials,
    transferCache: e.transferCache,
  };
}
var oa = (() => {
    class e {
      handler;
      constructor(n) {
        this.handler = n;
      }
      request(n, r, o = {}) {
        let i;
        if (n instanceof bn) i = n;
        else {
          let c;
          o.headers instanceof Le ? (c = o.headers) : (c = new Le(o.headers));
          let u;
          o.params &&
            (o.params instanceof Xe
              ? (u = o.params)
              : (u = new Xe({ fromObject: o.params }))),
            (i = new bn(n, r, o.body !== void 0 ? o.body : null, {
              headers: c,
              context: o.context,
              params: u,
              reportProgress: o.reportProgress,
              responseType: o.responseType || "json",
              withCredentials: o.withCredentials,
              transferCache: o.transferCache,
            }));
        }
        let s = sr(i).pipe(Qo((c) => this.handler.handle(c)));
        if (n instanceof bn || o.observe === "events") return s;
        let a = s.pipe(Yo((c) => c instanceof Sn));
        switch (o.observe || "body") {
          case "body":
            switch (i.responseType) {
              case "arraybuffer":
                return a.pipe(
                  J((c) => {
                    if (c.body !== null && !(c.body instanceof ArrayBuffer))
                      throw new Error("Response is not an ArrayBuffer.");
                    return c.body;
                  })
                );
              case "blob":
                return a.pipe(
                  J((c) => {
                    if (c.body !== null && !(c.body instanceof Blob))
                      throw new Error("Response is not a Blob.");
                    return c.body;
                  })
                );
              case "text":
                return a.pipe(
                  J((c) => {
                    if (c.body !== null && typeof c.body != "string")
                      throw new Error("Response is not a string.");
                    return c.body;
                  })
                );
              case "json":
              default:
                return a.pipe(J((c) => c.body));
            }
          case "response":
            return a;
          default:
            throw new Error(
              `Unreachable: unhandled observe type ${o.observe}}`
            );
        }
      }
      delete(n, r = {}) {
        return this.request("DELETE", n, r);
      }
      get(n, r = {}) {
        return this.request("GET", n, r);
      }
      head(n, r = {}) {
        return this.request("HEAD", n, r);
      }
      jsonp(n, r) {
        return this.request("JSONP", n, {
          params: new Xe().append(r, "JSONP_CALLBACK"),
          observe: "body",
          responseType: "json",
        });
      }
      options(n, r = {}) {
        return this.request("OPTIONS", n, r);
      }
      patch(n, r, o = {}) {
        return this.request("PATCH", n, Xs(o, r));
      }
      post(n, r, o = {}) {
        return this.request("POST", n, Xs(o, r));
      }
      put(n, r, o = {}) {
        return this.request("PUT", n, Xs(o, r));
      }
      static ɵfac = function (r) {
        return new (r || e)(w(Mn));
      };
      static ɵprov = S({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  rv = /^\)\]\}',?\n/,
  ov = "X-Request-URL";
function Dd(e) {
  if (e.url) return e.url;
  let t = ov.toLocaleLowerCase();
  return e.headers.get(t);
}
var iv = (() => {
    class e {
      fetchImpl =
        D(na, { optional: !0 })?.fetch ?? ((...n) => globalThis.fetch(...n));
      ngZone = D(F);
      handle(n) {
        return new k((r) => {
          let o = new AbortController();
          return (
            this.doRequest(n, o.signal, r).then(ra, (i) =>
              r.error(new Je({ error: i }))
            ),
            () => o.abort()
          );
        });
      }
      doRequest(n, r, o) {
        return Wt(this, null, function* () {
          let i = this.createRequestInit(n),
            s;
          try {
            let f = this.ngZone.runOutsideAngular(() =>
              this.fetchImpl(n.urlWithParams, N({ signal: r }, i))
            );
            sv(f), o.next({ type: et.Sent }), (s = yield f);
          } catch (f) {
            o.error(
              new Je({
                error: f,
                status: f.status ?? 0,
                statusText: f.statusText,
                url: n.urlWithParams,
                headers: f.headers,
              })
            );
            return;
          }
          let a = new Le(s.headers),
            c = s.statusText,
            u = Dd(s) ?? n.urlWithParams,
            l = s.status,
            d = null;
          if (
            (n.reportProgress &&
              o.next(new oo({ headers: a, status: l, statusText: c, url: u })),
            s.body)
          ) {
            let f = s.headers.get("content-length"),
              p = [],
              g = s.body.getReader(),
              y = 0,
              C,
              R,
              A = typeof Zone < "u" && Zone.current;
            yield this.ngZone.runOutsideAngular(() =>
              Wt(this, null, function* () {
                for (;;) {
                  let { done: Z, value: B } = yield g.read();
                  if (Z) break;
                  if ((p.push(B), (y += B.length), n.reportProgress)) {
                    R =
                      n.responseType === "text"
                        ? (R ?? "") +
                          (C ??= new TextDecoder()).decode(B, { stream: !0 })
                        : void 0;
                    let Te = () =>
                      o.next({
                        type: et.DownloadProgress,
                        total: f ? +f : void 0,
                        loaded: y,
                        partialText: R,
                      });
                    A ? A.run(Te) : Te();
                  }
                }
              })
            );
            let U = this.concatChunks(p, y);
            try {
              let Z = s.headers.get("Content-Type") ?? "";
              d = this.parseBody(n, U, Z);
            } catch (Z) {
              o.error(
                new Je({
                  error: Z,
                  headers: new Le(s.headers),
                  status: s.status,
                  statusText: s.statusText,
                  url: Dd(s) ?? n.urlWithParams,
                })
              );
              return;
            }
          }
          l === 0 && (l = d ? Cd : 0),
            l >= 200 && l < 300
              ? (o.next(
                  new Sn({
                    body: d,
                    headers: a,
                    status: l,
                    statusText: c,
                    url: u,
                  })
                ),
                o.complete())
              : o.error(
                  new Je({
                    error: d,
                    headers: a,
                    status: l,
                    statusText: c,
                    url: u,
                  })
                );
        });
      }
      parseBody(n, r, o) {
        switch (n.responseType) {
          case "json":
            let i = new TextDecoder().decode(r).replace(rv, "");
            return i === "" ? null : JSON.parse(i);
          case "text":
            return new TextDecoder().decode(r);
          case "blob":
            return new Blob([r], { type: o });
          case "arraybuffer":
            return r.buffer;
        }
      }
      createRequestInit(n) {
        let r = {},
          o = n.withCredentials ? "include" : void 0;
        if (
          (n.headers.forEach((i, s) => (r[i] = s.join(","))),
          n.headers.has("Accept") ||
            (r.Accept = "application/json, text/plain, */*"),
          !n.headers.has("Content-Type"))
        ) {
          let i = n.detectContentTypeHeader();
          i !== null && (r["Content-Type"] = i);
        }
        return {
          body: n.serializeBody(),
          method: n.method,
          headers: r,
          credentials: o,
        };
      }
      concatChunks(n, r) {
        let o = new Uint8Array(r),
          i = 0;
        for (let s of n) o.set(s, i), (i += s.length);
        return o;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = S({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  na = class {};
function ra() {}
function sv(e) {
  e.then(ra, ra);
}
function av(e, t) {
  return t(e);
}
function cv(e, t, n) {
  return (r, o) => Ur(n, () => t(r, (i) => e(i, o)));
}
var _d = new m(""),
  uv = new m(""),
  lv = new m("", { providedIn: "root", factory: () => !0 });
var Ed = (() => {
  class e extends Mn {
    backend;
    injector;
    chain = null;
    pendingTasks = D(jt);
    contributeToStability = D(lv);
    constructor(n, r) {
      super(), (this.backend = n), (this.injector = r);
    }
    handle(n) {
      if (this.chain === null) {
        let r = Array.from(
          new Set([...this.injector.get(_d), ...this.injector.get(uv, [])])
        );
        this.chain = r.reduceRight((o, i) => cv(o, i, this.injector), av);
      }
      if (this.contributeToStability) {
        let r = this.pendingTasks.add();
        return this.chain(n, (o) => this.backend.handle(o)).pipe(
          Ko(() => this.pendingTasks.remove(r))
        );
      } else return this.chain(n, (r) => this.backend.handle(r));
    }
    static ɵfac = function (r) {
      return new (r || e)(w(ro), w(Ne));
    };
    static ɵprov = S({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var dv = /^\)\]\}',?\n/;
function fv(e) {
  return "responseURL" in e && e.responseURL
    ? e.responseURL
    : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
    ? e.getResponseHeader("X-Request-URL")
    : null;
}
var wd = (() => {
    class e {
      xhrFactory;
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === "JSONP") throw new E(-2800, !1);
        let r = this.xhrFactory;
        return (r.ɵloadImpl ? st(r.ɵloadImpl()) : sr(null)).pipe(
          Jo(
            () =>
              new k((i) => {
                let s = r.build();
                if (
                  (s.open(n.method, n.urlWithParams),
                  n.withCredentials && (s.withCredentials = !0),
                  n.headers.forEach((g, y) =>
                    s.setRequestHeader(g, y.join(","))
                  ),
                  n.headers.has("Accept") ||
                    s.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*"
                    ),
                  !n.headers.has("Content-Type"))
                ) {
                  let g = n.detectContentTypeHeader();
                  g !== null && s.setRequestHeader("Content-Type", g);
                }
                if (n.responseType) {
                  let g = n.responseType.toLowerCase();
                  s.responseType = g !== "json" ? g : "text";
                }
                let a = n.serializeBody(),
                  c = null,
                  u = () => {
                    if (c !== null) return c;
                    let g = s.statusText || "OK",
                      y = new Le(s.getAllResponseHeaders()),
                      C = fv(s) || n.url;
                    return (
                      (c = new oo({
                        headers: y,
                        status: s.status,
                        statusText: g,
                        url: C,
                      })),
                      c
                    );
                  },
                  l = () => {
                    let { headers: g, status: y, statusText: C, url: R } = u(),
                      A = null;
                    y !== nv &&
                      (A =
                        typeof s.response > "u" ? s.responseText : s.response),
                      y === 0 && (y = A ? Cd : 0);
                    let U = y >= 200 && y < 300;
                    if (n.responseType === "json" && typeof A == "string") {
                      let Z = A;
                      A = A.replace(dv, "");
                      try {
                        A = A !== "" ? JSON.parse(A) : null;
                      } catch (B) {
                        (A = Z), U && ((U = !1), (A = { error: B, text: A }));
                      }
                    }
                    U
                      ? (i.next(
                          new Sn({
                            body: A,
                            headers: g,
                            status: y,
                            statusText: C,
                            url: R || void 0,
                          })
                        ),
                        i.complete())
                      : i.error(
                          new Je({
                            error: A,
                            headers: g,
                            status: y,
                            statusText: C,
                            url: R || void 0,
                          })
                        );
                  },
                  d = (g) => {
                    let { url: y } = u(),
                      C = new Je({
                        error: g,
                        status: s.status || 0,
                        statusText: s.statusText || "Unknown Error",
                        url: y || void 0,
                      });
                    i.error(C);
                  },
                  h = !1,
                  f = (g) => {
                    h || (i.next(u()), (h = !0));
                    let y = { type: et.DownloadProgress, loaded: g.loaded };
                    g.lengthComputable && (y.total = g.total),
                      n.responseType === "text" &&
                        s.responseText &&
                        (y.partialText = s.responseText),
                      i.next(y);
                  },
                  p = (g) => {
                    let y = { type: et.UploadProgress, loaded: g.loaded };
                    g.lengthComputable && (y.total = g.total), i.next(y);
                  };
                return (
                  s.addEventListener("load", l),
                  s.addEventListener("error", d),
                  s.addEventListener("timeout", d),
                  s.addEventListener("abort", d),
                  n.reportProgress &&
                    (s.addEventListener("progress", f),
                    a !== null &&
                      s.upload &&
                      s.upload.addEventListener("progress", p)),
                  s.send(a),
                  i.next({ type: et.Sent }),
                  () => {
                    s.removeEventListener("error", d),
                      s.removeEventListener("abort", d),
                      s.removeEventListener("load", l),
                      s.removeEventListener("timeout", d),
                      n.reportProgress &&
                        (s.removeEventListener("progress", f),
                        a !== null &&
                          s.upload &&
                          s.upload.removeEventListener("progress", p)),
                      s.readyState !== s.DONE && s.abort();
                  }
                );
              })
          )
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(w(Ht));
      };
      static ɵprov = S({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Id = new m(""),
  hv = "XSRF-TOKEN",
  pv = new m("", { providedIn: "root", factory: () => hv }),
  gv = "X-XSRF-TOKEN",
  mv = new m("", { providedIn: "root", factory: () => gv }),
  io = class {},
  yv = (() => {
    class e {
      doc;
      platform;
      cookieName;
      lastCookieString = "";
      lastToken = null;
      parseCount = 0;
      constructor(n, r, o) {
        (this.doc = n), (this.platform = r), (this.cookieName = o);
      }
      getToken() {
        if (this.platform === "server") return null;
        let n = this.doc.cookie || "";
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = eo(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(w(Me), w(Ye), w(pv));
      };
      static ɵprov = S({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function vv(e, t) {
  let n = e.url.toLowerCase();
  if (
    !D(Id) ||
    e.method === "GET" ||
    e.method === "HEAD" ||
    n.startsWith("http://") ||
    n.startsWith("https://")
  )
    return t(e);
  let r = D(io).getToken(),
    o = D(mv);
  return (
    r != null &&
      !e.headers.has(o) &&
      (e = e.clone({ headers: e.headers.set(o, r) })),
    t(e)
  );
}
function bd(...e) {
  let t = [
    oa,
    wd,
    Ed,
    { provide: Mn, useExisting: Ed },
    { provide: ro, useFactory: () => D(iv, { optional: !0 }) ?? D(wd) },
    { provide: _d, useValue: vv, multi: !0 },
    { provide: Id, useValue: !0 },
    { provide: io, useClass: yv },
  ];
  for (let n of e) t.push(...n.ɵproviders);
  return us(t);
}
var sa = class extends Xr {
    supportsDOMEvents = !0;
  },
  aa = class e extends sa {
    static makeCurrent() {
      fd(new e());
    }
    onAndCancel(t, n, r) {
      return (
        t.addEventListener(n, r),
        () => {
          t.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n);
    }
    remove(t) {
      t.remove();
    }
    createElement(t, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(t);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, n) {
      return n === "window"
        ? window
        : n === "document"
        ? t
        : n === "body"
        ? t.body
        : null;
    }
    getBaseHref(t) {
      let n = Ev();
      return n == null ? null : wv(n);
    }
    resetBaseElement() {
      Nn = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return eo(document.cookie, t);
    }
  },
  Nn = null;
function Ev() {
  return (
    (Nn = Nn || document.querySelector("base")),
    Nn ? Nn.getAttribute("href") : null
  );
}
function wv(e) {
  return new URL(e, document.baseURI).pathname;
}
var ca = class {
    addToWindow(t) {
      (Re.getAngularTestability = (r, o = !0) => {
        let i = t.findTestabilityInTree(r, o);
        if (i == null) throw new E(5103, !1);
        return i;
      }),
        (Re.getAllAngularTestabilities = () => t.getAllTestabilities()),
        (Re.getAllAngularRootElements = () => t.getAllRootElements());
      let n = (r) => {
        let o = Re.getAllAngularTestabilities(),
          i = o.length,
          s = function () {
            i--, i == 0 && r();
          };
        o.forEach((a) => {
          a.whenStable(s);
        });
      };
      Re.frameworkStabilizers || (Re.frameworkStabilizers = []),
        Re.frameworkStabilizers.push(n);
    }
    findTestabilityInTree(t, n, r) {
      if (n == null) return null;
      let o = t.getTestability(n);
      return (
        o ??
        (r
          ? mt().isShadowRoot(n)
            ? this.findTestabilityInTree(t, n.host, !0)
            : this.findTestabilityInTree(t, n.parentElement, !0)
          : null)
      );
    }
  },
  Cv = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = S({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  ua = new m(""),
  xd = (() => {
    class e {
      _zone;
      _plugins;
      _eventNameToPlugin = new Map();
      constructor(n, r) {
        (this._zone = r),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, r, o) {
        return this._findPluginFor(r).addEventListener(n, r, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let r = this._eventNameToPlugin.get(n);
        if (r) return r;
        if (((r = this._plugins.find((i) => i.supports(n))), !r))
          throw new E(5101, !1);
        return this._eventNameToPlugin.set(n, r), r;
      }
      static ɵfac = function (r) {
        return new (r || e)(w(ua), w(F));
      };
      static ɵprov = S({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  ao = class {
    _doc;
    constructor(t) {
      this._doc = t;
    }
    manager;
  },
  so = "ng-app-id";
function Md(e) {
  for (let t of e) t.remove();
}
function Td(e, t) {
  let n = t.createElement("style");
  return (n.textContent = e), n;
}
function _v(e, t, n, r) {
  let o = e.head?.querySelectorAll(`style[${so}="${t}"],link[${so}="${t}"]`);
  if (o)
    for (let i of o)
      i.removeAttribute(so),
        i instanceof HTMLLinkElement
          ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), {
              usage: 0,
              elements: [i],
            })
          : i.textContent && n.set(i.textContent, { usage: 0, elements: [i] });
}
function la(e, t) {
  let n = t.createElement("link");
  return n.setAttribute("rel", "stylesheet"), n.setAttribute("href", e), n;
}
var Od = (() => {
    class e {
      doc;
      appId;
      nonce;
      inline = new Map();
      external = new Map();
      hosts = new Set();
      isServer;
      constructor(n, r, o, i = {}) {
        (this.doc = n),
          (this.appId = r),
          (this.nonce = o),
          (this.isServer = to(i)),
          _v(n, r, this.inline, this.external),
          this.hosts.add(n.head);
      }
      addStyles(n, r) {
        for (let o of n) this.addUsage(o, this.inline, Td);
        r?.forEach((o) => this.addUsage(o, this.external, la));
      }
      removeStyles(n, r) {
        for (let o of n) this.removeUsage(o, this.inline);
        r?.forEach((o) => this.removeUsage(o, this.external));
      }
      addUsage(n, r, o) {
        let i = r.get(n);
        i
          ? i.usage++
          : r.set(n, {
              usage: 1,
              elements: [...this.hosts].map((s) =>
                this.addElement(s, o(n, this.doc))
              ),
            });
      }
      removeUsage(n, r) {
        let o = r.get(n);
        o && (o.usage--, o.usage <= 0 && (Md(o.elements), r.delete(n)));
      }
      ngOnDestroy() {
        for (let [, { elements: n }] of [...this.inline, ...this.external])
          Md(n);
        this.hosts.clear();
      }
      addHost(n) {
        this.hosts.add(n);
        for (let [r, { elements: o }] of this.inline)
          o.push(this.addElement(n, Td(r, this.doc)));
        for (let [r, { elements: o }] of this.external)
          o.push(this.addElement(n, la(r, this.doc)));
      }
      removeHost(n) {
        this.hosts.delete(n);
      }
      addElement(n, r) {
        return (
          this.nonce && r.setAttribute("nonce", this.nonce),
          this.isServer && r.setAttribute(so, this.appId),
          n.appendChild(r)
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(w(Me), w(bs), w(Ts, 8), w(Ye));
      };
      static ɵprov = S({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  ia = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  fa = /%COMP%/g,
  Rd = "%COMP%",
  Iv = `_nghost-${Rd}`,
  bv = `_ngcontent-${Rd}`,
  Mv = !0,
  Tv = new m("", { providedIn: "root", factory: () => Mv });
function Sv(e) {
  return bv.replace(fa, e);
}
function Nv(e) {
  return Iv.replace(fa, e);
}
function Fd(e, t) {
  return t.map((n) => n.replace(fa, e));
}
var Sd = (() => {
    class e {
      eventManager;
      sharedStylesHost;
      appId;
      removeStylesOnCompDestroy;
      doc;
      platformId;
      ngZone;
      nonce;
      rendererByCompId = new Map();
      defaultRenderer;
      platformIsServer;
      constructor(n, r, o, i, s, a, c, u = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = r),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = i),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = c),
          (this.nonce = u),
          (this.platformIsServer = to(a)),
          (this.defaultRenderer = new An(n, s, c, this.platformIsServer));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        this.platformIsServer &&
          r.encapsulation === Ce.ShadowDom &&
          (r = P(N({}, r), { encapsulation: Ce.Emulated }));
        let o = this.getOrCreateRenderer(n, r);
        return (
          o instanceof co
            ? o.applyToHost(n)
            : o instanceof xn && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, r) {
        let o = this.rendererByCompId,
          i = o.get(r.id);
        if (!i) {
          let s = this.doc,
            a = this.ngZone,
            c = this.eventManager,
            u = this.sharedStylesHost,
            l = this.removeStylesOnCompDestroy,
            d = this.platformIsServer;
          switch (r.encapsulation) {
            case Ce.Emulated:
              i = new co(c, u, r, this.appId, l, s, a, d);
              break;
            case Ce.ShadowDom:
              return new da(c, u, n, r, s, a, this.nonce, d);
            default:
              i = new xn(c, u, r, l, s, a, d);
              break;
          }
          o.set(r.id, i);
        }
        return i;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      static ɵfac = function (r) {
        return new (r || e)(
          w(xd),
          w(Od),
          w(bs),
          w(Tv),
          w(Me),
          w(Ye),
          w(F),
          w(Ts)
        );
      };
      static ɵprov = S({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  An = class {
    eventManager;
    doc;
    ngZone;
    platformIsServer;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(t, n, r, o) {
      (this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = o);
    }
    destroy() {}
    destroyNode = null;
    createElement(t, n) {
      return n
        ? this.doc.createElementNS(ia[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (Nd(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (Nd(t) ? t.content : t).insertBefore(n, r);
    }
    removeChild(t, n) {
      n.remove();
    }
    selectRootElement(t, n) {
      let r = typeof t == "string" ? this.doc.querySelector(t) : t;
      if (!r) throw new E(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, n, r, o) {
      if (o) {
        n = o + ":" + n;
        let i = ia[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = ia[r];
        o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
      } else t.removeAttribute(n);
    }
    addClass(t, n) {
      t.classList.add(n);
    }
    removeClass(t, n) {
      t.classList.remove(n);
    }
    setStyle(t, n, r, o) {
      o & (Oe.DashCase | Oe.Important)
        ? t.style.setProperty(n, r, o & Oe.Important ? "important" : "")
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & Oe.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r);
    }
    setValue(t, n) {
      t.nodeValue = n;
    }
    listen(t, n, r) {
      if (
        typeof t == "string" &&
        ((t = mt().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${n}`);
      return this.eventManager.addEventListener(
        t,
        n,
        this.decoratePreventDefault(r)
      );
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === "__ngUnwrap__") return t;
        (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function Nd(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var da = class extends An {
    sharedStylesHost;
    hostEl;
    shadowRoot;
    constructor(t, n, r, o, i, s, a, c) {
      super(t, i, s, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let u = Fd(o.id, o.styles);
      for (let d of u) {
        let h = document.createElement("style");
        a && h.setAttribute("nonce", a),
          (h.textContent = d),
          this.shadowRoot.appendChild(h);
      }
      let l = o.getExternalStyles?.();
      if (l)
        for (let d of l) {
          let h = la(d, i);
          a && h.setAttribute("nonce", a), this.shadowRoot.appendChild(h);
        }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n);
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
    }
    removeChild(t, n) {
      return super.removeChild(null, n);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  xn = class extends An {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(t, n, r, o, i, s, a, c) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = c ? Fd(c, r.styles) : r.styles),
        (this.styleUrls = r.getExternalStyles?.(c));
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
    }
  },
  co = class extends xn {
    contentAttr;
    hostAttr;
    constructor(t, n, r, o, i, s, a, c) {
      let u = o + "-" + r.id;
      super(t, n, r, i, s, a, c, u),
        (this.contentAttr = Sv(u)),
        (this.hostAttr = Nv(u));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  Av = (() => {
    class e extends ao {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, r, o) {
        return (
          n.addEventListener(r, o, !1), () => this.removeEventListener(n, r, o)
        );
      }
      removeEventListener(n, r, o) {
        return n.removeEventListener(r, o);
      }
      static ɵfac = function (r) {
        return new (r || e)(w(Me));
      };
      static ɵprov = S({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Ad = ["alt", "control", "meta", "shift"],
  xv = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  Ov = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Rv = (() => {
    class e extends ao {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, r, o) {
        let i = e.parseEventName(r),
          s = e.eventCallback(i.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => mt().onAndCancel(n, i.domEventName, s));
      }
      static parseEventName(n) {
        let r = n.toLowerCase().split("."),
          o = r.shift();
        if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let i = e._normalizeKey(r.pop()),
          s = "",
          a = r.indexOf("code");
        if (
          (a > -1 && (r.splice(a, 1), (s = "code.")),
          Ad.forEach((u) => {
            let l = r.indexOf(u);
            l > -1 && (r.splice(l, 1), (s += u + "."));
          }),
          (s += i),
          r.length != 0 || i.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = o), (c.fullKey = s), c;
      }
      static matchEventFullKeyCode(n, r) {
        let o = xv[n.key] || n.key,
          i = "";
        return (
          r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Ad.forEach((s) => {
                if (s !== o) {
                  let a = Ov[s];
                  a(n) && (i += s + ".");
                }
              }),
              (i += o),
              i === r)
        );
      }
      static eventCallback(n, r, o) {
        return (i) => {
          e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
      static ɵfac = function (r) {
        return new (r || e)(w(Me));
      };
      static ɵprov = S({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function Fv() {
  aa.makeCurrent();
}
function Pv() {
  return new ze();
}
function kv() {
  return ul(document), document;
}
var Lv = [
    { provide: Ye, useValue: pd },
    { provide: Ms, useValue: Fv, multi: !0 },
    { provide: Me, useFactory: kv, deps: [] },
  ],
  Pd = Js(ad, "browser", Lv),
  Vv = new m(""),
  jv = [
    { provide: wn, useClass: ca, deps: [] },
    { provide: qs, useClass: Qr, deps: [F, Kr, wn] },
    { provide: Qr, useClass: Qr, deps: [F, Kr, wn] },
  ],
  Bv = [
    { provide: Hr, useValue: "root" },
    { provide: ze, useFactory: Pv, deps: [] },
    { provide: ua, useClass: Av, multi: !0, deps: [Me, F, Ye] },
    { provide: ua, useClass: Rv, multi: !0, deps: [Me] },
    Sd,
    Od,
    xd,
    { provide: Pt, useExisting: Sd },
    { provide: Ht, useClass: Cv, deps: [] },
    [],
  ],
  kd = (() => {
    class e {
      constructor(n) {}
      static ɵfac = function (r) {
        return new (r || e)(w(Vv, 12));
      };
      static ɵmod = ve({ type: e });
      static ɵinj = me({ providers: [...Bv, ...jv], imports: [hd, cd] });
    }
    return e;
  })();
var zd = (() => {
    class e {
      _renderer;
      _elementRef;
      onChange = (n) => {};
      onTouched = () => {};
      constructor(n, r) {
        (this._renderer = n), (this._elementRef = r);
      }
      setProperty(n, r) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, r);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty("disabled", n);
      }
      static ɵfac = function (r) {
        return new (r || e)(O(vn), O(Bt));
      };
      static ɵdir = G({ type: e });
    }
    return e;
  })(),
  Wd = (() => {
    class e extends zd {
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = gn(e)))(o || e);
        };
      })();
      static ɵdir = G({ type: e, features: [re] });
    }
    return e;
  })(),
  va = new m("");
var Uv = { provide: va, useExisting: _e(() => Eo), multi: !0 };
function $v() {
  let e = mt() ? mt().getUserAgent() : "";
  return /android (\d+)/.test(e.toLowerCase());
}
var Gv = new m(""),
  Eo = (() => {
    class e extends zd {
      _compositionMode;
      _composing = !1;
      constructor(n, r, o) {
        super(n, r),
          (this._compositionMode = o),
          this._compositionMode == null && (this._compositionMode = !$v());
      }
      writeValue(n) {
        let r = n ?? "";
        this.setProperty("value", r);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(O(vn), O(Bt), O(Gv, 8));
      };
      static ɵdir = G({
        type: e,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            Pe("input", function (s) {
              return o._handleInput(s.target.value);
            })("blur", function () {
              return o.onTouched();
            })("compositionstart", function () {
              return o._compositionStart();
            })("compositionend", function (s) {
              return o._compositionEnd(s.target.value);
            });
        },
        standalone: !1,
        features: [Ke([Uv]), re],
      });
    }
    return e;
  })();
function tt(e) {
  return (
    e == null || ((typeof e == "string" || Array.isArray(e)) && e.length === 0)
  );
}
function qd(e) {
  return e != null && typeof e.length == "number";
}
var Ln = new m(""),
  wo = new m(""),
  zv =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  Ve = class {
    static min(t) {
      return Zd(t);
    }
    static max(t) {
      return Wv(t);
    }
    static required(t) {
      return qv(t);
    }
    static requiredTrue(t) {
      return Zv(t);
    }
    static email(t) {
      return Yv(t);
    }
    static minLength(t) {
      return Qv(t);
    }
    static maxLength(t) {
      return Kv(t);
    }
    static pattern(t) {
      return Jv(t);
    }
    static nullValidator(t) {
      return fo(t);
    }
    static compose(t) {
      return ef(t);
    }
    static composeAsync(t) {
      return nf(t);
    }
  };
function Zd(e) {
  return (t) => {
    if (tt(t.value) || tt(e)) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n < e ? { min: { min: e, actual: t.value } } : null;
  };
}
function Wv(e) {
  return (t) => {
    if (tt(t.value) || tt(e)) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n > e ? { max: { max: e, actual: t.value } } : null;
  };
}
function qv(e) {
  return tt(e.value) ? { required: !0 } : null;
}
function Zv(e) {
  return e.value === !0 ? null : { required: !0 };
}
function Yv(e) {
  return tt(e.value) || zv.test(e.value) ? null : { email: !0 };
}
function Qv(e) {
  return (t) =>
    tt(t.value) || !qd(t.value)
      ? null
      : t.value.length < e
      ? { minlength: { requiredLength: e, actualLength: t.value.length } }
      : null;
}
function Kv(e) {
  return (t) =>
    qd(t.value) && t.value.length > e
      ? { maxlength: { requiredLength: e, actualLength: t.value.length } }
      : null;
}
function Jv(e) {
  if (!e) return fo;
  let t, n;
  return (
    typeof e == "string"
      ? ((n = ""),
        e.charAt(0) !== "^" && (n += "^"),
        (n += e),
        e.charAt(e.length - 1) !== "$" && (n += "$"),
        (t = new RegExp(n)))
      : ((n = e.toString()), (t = e)),
    (r) => {
      if (tt(r.value)) return null;
      let o = r.value;
      return t.test(o)
        ? null
        : { pattern: { requiredPattern: n, actualValue: o } };
    }
  );
}
function fo(e) {
  return null;
}
function Yd(e) {
  return e != null;
}
function Qd(e) {
  return Cn(e) ? st(e) : e;
}
function Kd(e) {
  let t = {};
  return (
    e.forEach((n) => {
      t = n != null ? N(N({}, t), n) : t;
    }),
    Object.keys(t).length === 0 ? null : t
  );
}
function Jd(e, t) {
  return t.map((n) => n(e));
}
function Xv(e) {
  return !e.validate;
}
function Xd(e) {
  return e.map((t) => (Xv(t) ? t : (n) => t.validate(n)));
}
function ef(e) {
  if (!e) return null;
  let t = e.filter(Yd);
  return t.length == 0
    ? null
    : function (n) {
        return Kd(Jd(n, t));
      };
}
function tf(e) {
  return e != null ? ef(Xd(e)) : null;
}
function nf(e) {
  if (!e) return null;
  let t = e.filter(Yd);
  return t.length == 0
    ? null
    : function (n) {
        let r = Jd(n, t).map(Qd);
        return Zo(r).pipe(J(Kd));
      };
}
function rf(e) {
  return e != null ? nf(Xd(e)) : null;
}
function Ld(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
}
function of(e) {
  return e._rawValidators;
}
function sf(e) {
  return e._rawAsyncValidators;
}
function ha(e) {
  return e ? (Array.isArray(e) ? e : [e]) : [];
}
function ho(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
function Vd(e, t) {
  let n = ha(t);
  return (
    ha(e).forEach((o) => {
      ho(n, o) || n.push(o);
    }),
    n
  );
}
function jd(e, t) {
  return ha(t).filter((n) => !ho(e, n));
}
var po = class {
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators = [];
    _rawAsyncValidators = [];
    _setValidators(t) {
      (this._rawValidators = t || []),
        (this._composedValidatorFn = tf(this._rawValidators));
    }
    _setAsyncValidators(t) {
      (this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = rf(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _onDestroyCallbacks = [];
    _registerOnDestroy(t) {
      this._onDestroyCallbacks.push(t);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((t) => t()),
        (this._onDestroyCallbacks = []);
    }
    reset(t = void 0) {
      this.control && this.control.reset(t);
    }
    hasError(t, n) {
      return this.control ? this.control.hasError(t, n) : !1;
    }
    getError(t, n) {
      return this.control ? this.control.getError(t, n) : null;
    }
  },
  le = class extends po {
    name;
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  kn = class extends po {
    _parent = null;
    name = null;
    valueAccessor = null;
  },
  go = class {
    _cd;
    constructor(t) {
      this._cd = t;
    }
    get isTouched() {
      return this._cd?.control?._touched?.(), !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return this._cd?.control?._pristine?.(), !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return this._cd?.control?._status?.(), !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return this._cd?._submitted?.(), !!this._cd?.submitted;
    }
  },
  eD = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  qI = P(N({}, eD), { "[class.ng-submitted]": "isSubmitted" }),
  af = (() => {
    class e extends go {
      constructor(n) {
        super(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(O(kn, 2));
      };
      static ɵdir = G({
        type: e,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (r, o) {
          r & 2 &&
            Jr("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending);
        },
        standalone: !1,
        features: [re],
      });
    }
    return e;
  })(),
  cf = (() => {
    class e extends go {
      constructor(n) {
        super(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(O(le, 10));
      };
      static ɵdir = G({
        type: e,
        selectors: [
          ["", "formGroupName", ""],
          ["", "formArrayName", ""],
          ["", "ngModelGroup", ""],
          ["", "formGroup", ""],
          ["form", 3, "ngNoForm", ""],
          ["", "ngForm", ""],
        ],
        hostVars: 16,
        hostBindings: function (r, o) {
          r & 2 &&
            Jr("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending)("ng-submitted", o.isSubmitted);
        },
        standalone: !1,
        features: [re],
      });
    }
    return e;
  })();
var On = "VALID",
  uo = "INVALID",
  Ut = "PENDING",
  Rn = "DISABLED",
  nt = class {},
  mo = class extends nt {
    value;
    source;
    constructor(t, n) {
      super(), (this.value = t), (this.source = n);
    }
  },
  Fn = class extends nt {
    pristine;
    source;
    constructor(t, n) {
      super(), (this.pristine = t), (this.source = n);
    }
  },
  Pn = class extends nt {
    touched;
    source;
    constructor(t, n) {
      super(), (this.touched = t), (this.source = n);
    }
  },
  $t = class extends nt {
    status;
    source;
    constructor(t, n) {
      super(), (this.status = t), (this.source = n);
    }
  },
  pa = class extends nt {
    source;
    constructor(t) {
      super(), (this.source = t);
    }
  },
  ga = class extends nt {
    source;
    constructor(t) {
      super(), (this.source = t);
    }
  };
function Da(e) {
  return (Co(e) ? e.validators : e) || null;
}
function tD(e) {
  return Array.isArray(e) ? tf(e) : e || null;
}
function Ea(e, t) {
  return (Co(t) ? t.asyncValidators : e) || null;
}
function nD(e) {
  return Array.isArray(e) ? rf(e) : e || null;
}
function Co(e) {
  return e != null && !Array.isArray(e) && typeof e == "object";
}
function uf(e, t, n) {
  let r = e.controls;
  if (!(t ? Object.keys(r) : r).length) throw new E(1e3, "");
  if (!r[n]) throw new E(1001, "");
}
function lf(e, t, n) {
  e._forEachChild((r, o) => {
    if (n[o] === void 0) throw new E(1002, "");
  });
}
var Gt = class {
    _pendingDirty = !1;
    _hasOwnPendingAsyncValidator = null;
    _pendingTouched = !1;
    _onCollectionChange = () => {};
    _updateOn;
    _parent = null;
    _asyncValidationSubscription;
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators;
    _rawAsyncValidators;
    value;
    constructor(t, n) {
      this._assignValidators(t), this._assignAsyncValidators(n);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(t) {
      this._rawValidators = this._composedValidatorFn = t;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(t) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
    }
    get parent() {
      return this._parent;
    }
    get status() {
      return ke(this.statusReactive);
    }
    set status(t) {
      ke(() => this.statusReactive.set(t));
    }
    _status = In(() => this.statusReactive());
    statusReactive = Dn(void 0);
    get valid() {
      return this.status === On;
    }
    get invalid() {
      return this.status === uo;
    }
    get pending() {
      return this.status == Ut;
    }
    get disabled() {
      return this.status === Rn;
    }
    get enabled() {
      return this.status !== Rn;
    }
    errors;
    get pristine() {
      return ke(this.pristineReactive);
    }
    set pristine(t) {
      ke(() => this.pristineReactive.set(t));
    }
    _pristine = In(() => this.pristineReactive());
    pristineReactive = Dn(!0);
    get dirty() {
      return !this.pristine;
    }
    get touched() {
      return ke(this.touchedReactive);
    }
    set touched(t) {
      ke(() => this.touchedReactive.set(t));
    }
    _touched = In(() => this.touchedReactive());
    touchedReactive = Dn(!1);
    get untouched() {
      return !this.touched;
    }
    _events = new Se();
    events = this._events.asObservable();
    valueChanges;
    statusChanges;
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : "change";
    }
    setValidators(t) {
      this._assignValidators(t);
    }
    setAsyncValidators(t) {
      this._assignAsyncValidators(t);
    }
    addValidators(t) {
      this.setValidators(Vd(t, this._rawValidators));
    }
    addAsyncValidators(t) {
      this.setAsyncValidators(Vd(t, this._rawAsyncValidators));
    }
    removeValidators(t) {
      this.setValidators(jd(t, this._rawValidators));
    }
    removeAsyncValidators(t) {
      this.setAsyncValidators(jd(t, this._rawAsyncValidators));
    }
    hasValidator(t) {
      return ho(this._rawValidators, t);
    }
    hasAsyncValidator(t) {
      return ho(this._rawAsyncValidators, t);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(t = {}) {
      let n = this.touched === !1;
      this.touched = !0;
      let r = t.sourceControl ?? this;
      this._parent &&
        !t.onlySelf &&
        this._parent.markAsTouched(P(N({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new Pn(!0, r));
    }
    markAllAsTouched(t = {}) {
      this.markAsTouched({
        onlySelf: !0,
        emitEvent: t.emitEvent,
        sourceControl: this,
      }),
        this._forEachChild((n) => n.markAllAsTouched(t));
    }
    markAsUntouched(t = {}) {
      let n = this.touched === !0;
      (this.touched = !1), (this._pendingTouched = !1);
      let r = t.sourceControl ?? this;
      this._forEachChild((o) => {
        o.markAsUntouched({
          onlySelf: !0,
          emitEvent: t.emitEvent,
          sourceControl: r,
        });
      }),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, r),
        n && t.emitEvent !== !1 && this._events.next(new Pn(!1, r));
    }
    markAsDirty(t = {}) {
      let n = this.pristine === !0;
      this.pristine = !1;
      let r = t.sourceControl ?? this;
      this._parent &&
        !t.onlySelf &&
        this._parent.markAsDirty(P(N({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new Fn(!1, r));
    }
    markAsPristine(t = {}) {
      let n = this.pristine === !1;
      (this.pristine = !0), (this._pendingDirty = !1);
      let r = t.sourceControl ?? this;
      this._forEachChild((o) => {
        o.markAsPristine({ onlySelf: !0, emitEvent: t.emitEvent });
      }),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, r),
        n && t.emitEvent !== !1 && this._events.next(new Fn(!0, r));
    }
    markAsPending(t = {}) {
      this.status = Ut;
      let n = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new $t(this.status, n)),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.markAsPending(P(N({}, t), { sourceControl: n }));
    }
    disable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = Rn),
        (this.errors = null),
        this._forEachChild((o) => {
          o.disable(P(N({}, t), { onlySelf: !0 }));
        }),
        this._updateValue();
      let r = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new mo(this.value, r)),
        this._events.next(new $t(this.status, r)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(P(N({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((o) => o(!0));
    }
    enable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = On),
        this._forEachChild((r) => {
          r.enable(P(N({}, t), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
        this._updateAncestors(P(N({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((r) => r(!1));
    }
    _updateAncestors(t, n) {
      this._parent &&
        !t.onlySelf &&
        (this._parent.updateValueAndValidity(t),
        t.skipPristineCheck || this._parent._updatePristine({}, n),
        this._parent._updateTouched({}, n));
    }
    setParent(t) {
      this._parent = t;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(t = {}) {
      if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
        let r = this._cancelExistingSubscription();
        (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === On || this.status === Ut) &&
            this._runAsyncValidator(r, t.emitEvent);
      }
      let n = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new mo(this.value, n)),
        this._events.next(new $t(this.status, n)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.updateValueAndValidity(
            P(N({}, t), { sourceControl: n })
          );
    }
    _updateTreeValidity(t = { emitEvent: !0 }) {
      this._forEachChild((n) => n._updateTreeValidity(t)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? Rn : On;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(t, n) {
      if (this.asyncValidator) {
        (this.status = Ut),
          (this._hasOwnPendingAsyncValidator = { emitEvent: n !== !1 });
        let r = Qd(this.asyncValidator(this));
        this._asyncValidationSubscription = r.subscribe((o) => {
          (this._hasOwnPendingAsyncValidator = null),
            this.setErrors(o, { emitEvent: n, shouldHaveEmitted: t });
        });
      }
    }
    _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let t = this._hasOwnPendingAsyncValidator?.emitEvent ?? !1;
        return (this._hasOwnPendingAsyncValidator = null), t;
      }
      return !1;
    }
    setErrors(t, n = {}) {
      (this.errors = t),
        this._updateControlsErrors(
          n.emitEvent !== !1,
          this,
          n.shouldHaveEmitted
        );
    }
    get(t) {
      let n = t;
      return n == null ||
        (Array.isArray(n) || (n = n.split(".")), n.length === 0)
        ? null
        : n.reduce((r, o) => r && r._find(o), this);
    }
    getError(t, n) {
      let r = n ? this.get(n) : this;
      return r && r.errors ? r.errors[t] : null;
    }
    hasError(t, n) {
      return !!this.getError(t, n);
    }
    get root() {
      let t = this;
      for (; t._parent; ) t = t._parent;
      return t;
    }
    _updateControlsErrors(t, n, r) {
      (this.status = this._calculateStatus()),
        t && this.statusChanges.emit(this.status),
        (t || r) && this._events.next(new $t(this.status, n)),
        this._parent && this._parent._updateControlsErrors(t, n, r);
    }
    _initObservables() {
      (this.valueChanges = new te()), (this.statusChanges = new te());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? Rn
        : this.errors
        ? uo
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Ut)
        ? Ut
        : this._anyControlsHaveStatus(uo)
        ? uo
        : On;
    }
    _anyControlsHaveStatus(t) {
      return this._anyControls((n) => n.status === t);
    }
    _anyControlsDirty() {
      return this._anyControls((t) => t.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((t) => t.touched);
    }
    _updatePristine(t, n) {
      let r = !this._anyControlsDirty(),
        o = this.pristine !== r;
      (this.pristine = r),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, n),
        o && this._events.next(new Fn(this.pristine, n));
    }
    _updateTouched(t = {}, n) {
      (this.touched = this._anyControlsTouched()),
        this._events.next(new Pn(this.touched, n)),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, n);
    }
    _onDisabledChange = [];
    _registerOnCollectionChange(t) {
      this._onCollectionChange = t;
    }
    _setUpdateStrategy(t) {
      Co(t) && t.updateOn != null && (this._updateOn = t.updateOn);
    }
    _parentMarkedDirty(t) {
      let n = this._parent && this._parent.dirty;
      return !t && !!n && !this._parent._anyControlsDirty();
    }
    _find(t) {
      return null;
    }
    _assignValidators(t) {
      (this._rawValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedValidatorFn = tD(this._rawValidators));
    }
    _assignAsyncValidators(t) {
      (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedAsyncValidatorFn = nD(this._rawAsyncValidators));
    }
  },
  yo = class extends Gt {
    constructor(t, n, r) {
      super(Da(n), Ea(r, n)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(n),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    controls;
    registerControl(t, n) {
      return this.controls[t]
        ? this.controls[t]
        : ((this.controls[t] = n),
          n.setParent(this),
          n._registerOnCollectionChange(this._onCollectionChange),
          n);
    }
    addControl(t, n, r = {}) {
      this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(t, n = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    setControl(t, n, r = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        n && this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    contains(t) {
      return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
    }
    setValue(t, n = {}) {
      lf(this, !0, t),
        Object.keys(t).forEach((r) => {
          uf(this, !0, r),
            this.controls[r].setValue(t[r], {
              onlySelf: !0,
              emitEvent: n.emitEvent,
            });
        }),
        this.updateValueAndValidity(n);
    }
    patchValue(t, n = {}) {
      t != null &&
        (Object.keys(t).forEach((r) => {
          let o = this.controls[r];
          o && o.patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n));
    }
    reset(t = {}, n = {}) {
      this._forEachChild((r, o) => {
        r.reset(t ? t[o] : null, { onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._updatePristine(n, this),
        this._updateTouched(n, this),
        this.updateValueAndValidity(n);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (t, n, r) => ((t[r] = n.getRawValue()), t)
      );
    }
    _syncPendingControls() {
      let t = this._reduceChildren(!1, (n, r) =>
        r._syncPendingControls() ? !0 : n
      );
      return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
    }
    _forEachChild(t) {
      Object.keys(this.controls).forEach((n) => {
        let r = this.controls[n];
        r && t(r, n);
      });
    }
    _setUpControls() {
      this._forEachChild((t) => {
        t.setParent(this),
          t._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(t) {
      for (let [n, r] of Object.entries(this.controls))
        if (this.contains(n) && t(r)) return !0;
      return !1;
    }
    _reduceValue() {
      let t = {};
      return this._reduceChildren(
        t,
        (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value), n)
      );
    }
    _reduceChildren(t, n) {
      let r = t;
      return (
        this._forEachChild((o, i) => {
          r = n(r, o, i);
        }),
        r
      );
    }
    _allControlsDisabled() {
      for (let t of Object.keys(this.controls))
        if (this.controls[t].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(t) {
      return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
    }
  };
var ma = class extends yo {};
var df = new m("CallSetDisabledState", {
    providedIn: "root",
    factory: () => wa,
  }),
  wa = "always";
function Ca(e, t) {
  return [...t.path, e];
}
function Bd(e, t, n = wa) {
  _a(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === "always") &&
      t.valueAccessor.setDisabledState?.(e.disabled),
    oD(e, t),
    sD(e, t),
    iD(e, t),
    rD(e, t);
}
function Hd(e, t, n = !0) {
  let r = () => {};
  t.valueAccessor &&
    (t.valueAccessor.registerOnChange(r), t.valueAccessor.registerOnTouched(r)),
    Do(e, t),
    e &&
      (t._invokeOnDestroyCallbacks(), e._registerOnCollectionChange(() => {}));
}
function vo(e, t) {
  e.forEach((n) => {
    n.registerOnValidatorChange && n.registerOnValidatorChange(t);
  });
}
function rD(e, t) {
  if (t.valueAccessor.setDisabledState) {
    let n = (r) => {
      t.valueAccessor.setDisabledState(r);
    };
    e.registerOnDisabledChange(n),
      t._registerOnDestroy(() => {
        e._unregisterOnDisabledChange(n);
      });
  }
}
function _a(e, t) {
  let n = of(e);
  t.validator !== null
    ? e.setValidators(Ld(n, t.validator))
    : typeof n == "function" && e.setValidators([n]);
  let r = sf(e);
  t.asyncValidator !== null
    ? e.setAsyncValidators(Ld(r, t.asyncValidator))
    : typeof r == "function" && e.setAsyncValidators([r]);
  let o = () => e.updateValueAndValidity();
  vo(t._rawValidators, o), vo(t._rawAsyncValidators, o);
}
function Do(e, t) {
  let n = !1;
  if (e !== null) {
    if (t.validator !== null) {
      let o = of(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.validator);
        i.length !== o.length && ((n = !0), e.setValidators(i));
      }
    }
    if (t.asyncValidator !== null) {
      let o = sf(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.asyncValidator);
        i.length !== o.length && ((n = !0), e.setAsyncValidators(i));
      }
    }
  }
  let r = () => {};
  return vo(t._rawValidators, r), vo(t._rawAsyncValidators, r), n;
}
function oD(e, t) {
  t.valueAccessor.registerOnChange((n) => {
    (e._pendingValue = n),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === "change" && ff(e, t);
  });
}
function iD(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    (e._pendingTouched = !0),
      e.updateOn === "blur" && e._pendingChange && ff(e, t),
      e.updateOn !== "submit" && e.markAsTouched();
  });
}
function ff(e, t) {
  e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1);
}
function sD(e, t) {
  let n = (r, o) => {
    t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
  };
  e.registerOnChange(n),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(n);
    });
}
function aD(e, t) {
  e == null, _a(e, t);
}
function cD(e, t) {
  return Do(e, t);
}
function uD(e, t) {
  if (!e.hasOwnProperty("model")) return !1;
  let n = e.model;
  return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue);
}
function lD(e) {
  return Object.getPrototypeOf(e.constructor) === Wd;
}
function dD(e, t) {
  e._syncPendingControls(),
    t.forEach((n) => {
      let r = n.control;
      r.updateOn === "submit" &&
        r._pendingChange &&
        (n.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
    });
}
function fD(e, t) {
  if (!t) return null;
  Array.isArray(t);
  let n, r, o;
  return (
    t.forEach((i) => {
      i.constructor === Eo ? (n = i) : lD(i) ? (r = i) : (o = i);
    }),
    o || r || n || null
  );
}
function hD(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Ud(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function $d(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    Object.keys(e).length === 2 &&
    "value" in e &&
    "disabled" in e
  );
}
var lo = class extends Gt {
  defaultValue = null;
  _onChange = [];
  _pendingValue;
  _pendingChange = !1;
  constructor(t = null, n, r) {
    super(Da(n), Ea(r, n)),
      this._applyFormState(t),
      this._setUpdateStrategy(n),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Co(n) &&
        (n.nonNullable || n.initialValueIsDefault) &&
        ($d(t) ? (this.defaultValue = t.value) : (this.defaultValue = t));
  }
  setValue(t, n = {}) {
    (this.value = this._pendingValue = t),
      this._onChange.length &&
        n.emitModelToViewChange !== !1 &&
        this._onChange.forEach((r) =>
          r(this.value, n.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(n);
  }
  patchValue(t, n = {}) {
    this.setValue(t, n);
  }
  reset(t = this.defaultValue, n = {}) {
    this._applyFormState(t),
      this.markAsPristine(n),
      this.markAsUntouched(n),
      this.setValue(this.value, n),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(t) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(t) {
    this._onChange.push(t);
  }
  _unregisterOnChange(t) {
    Ud(this._onChange, t);
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t);
  }
  _unregisterOnDisabledChange(t) {
    Ud(this._onDisabledChange, t);
  }
  _forEachChild(t) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(t) {
    $d(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t);
  }
};
var pD = (e) => e instanceof lo,
  gD = (() => {
    class e extends le {
      _parent;
      ngOnInit() {
        this._checkParentType(), this.formDirective.addFormGroup(this);
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeFormGroup(this);
      }
      get control() {
        return this.formDirective.getFormGroup(this);
      }
      get path() {
        return Ca(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = gn(e)))(o || e);
        };
      })();
      static ɵdir = G({ type: e, standalone: !1, features: [re] });
    }
    return e;
  })();
var hf = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = G({
        type: e,
        selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
        hostAttrs: ["novalidate", ""],
        standalone: !1,
      });
    }
    return e;
  })(),
  mD = { provide: va, useExisting: _e(() => Ia), multi: !0 },
  Ia = (() => {
    class e extends Wd {
      writeValue(n) {
        let r = n ?? "";
        this.setProperty("value", r);
      }
      registerOnChange(n) {
        this.onChange = (r) => {
          n(r == "" ? null : parseFloat(r));
        };
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = gn(e)))(o || e);
        };
      })();
      static ɵdir = G({
        type: e,
        selectors: [
          ["input", "type", "number", "formControlName", ""],
          ["input", "type", "number", "formControl", ""],
          ["input", "type", "number", "ngModel", ""],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            Pe("input", function (s) {
              return o.onChange(s.target.value);
            })("blur", function () {
              return o.onTouched();
            });
        },
        standalone: !1,
        features: [Ke([mD]), re],
      });
    }
    return e;
  })();
var pf = new m("");
var yD = { provide: le, useExisting: _e(() => _o) },
  _o = (() => {
    class e extends le {
      callSetDisabledState;
      get submitted() {
        return ke(this._submittedReactive);
      }
      set submitted(n) {
        this._submittedReactive.set(n);
      }
      _submitted = In(() => this._submittedReactive());
      _submittedReactive = Dn(!1);
      _oldForm;
      _onCollectionChange = () => this._updateDomValue();
      directives = [];
      form = null;
      ngSubmit = new te();
      constructor(n, r, o) {
        super(),
          (this.callSetDisabledState = o),
          this._setValidators(n),
          this._setAsyncValidators(r);
      }
      ngOnChanges(n) {
        this._checkFormPresent(),
          n.hasOwnProperty("form") &&
            (this._updateValidators(),
            this._updateDomValue(),
            this._updateRegistrations(),
            (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (Do(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(n) {
        let r = this.form.get(n.path);
        return (
          Bd(r, n, this.callSetDisabledState),
          r.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(n),
          r
        );
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        Hd(n.control || null, n, !1), hD(this.directives, n);
      }
      addFormGroup(n) {
        this._setUpFormContainer(n);
      }
      removeFormGroup(n) {
        this._cleanUpFormContainer(n);
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      addFormArray(n) {
        this._setUpFormContainer(n);
      }
      removeFormArray(n) {
        this._cleanUpFormContainer(n);
      }
      getFormArray(n) {
        return this.form.get(n.path);
      }
      updateModel(n, r) {
        this.form.get(n.path).setValue(r);
      }
      onSubmit(n) {
        return (
          this._submittedReactive.set(!0),
          dD(this.form, this.directives),
          this.ngSubmit.emit(n),
          this.form._events.next(new pa(this.control)),
          n?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n),
          this._submittedReactive.set(!1),
          this.form._events.next(new ga(this.form));
      }
      _updateDomValue() {
        this.directives.forEach((n) => {
          let r = n.control,
            o = this.form.get(n.path);
          r !== o &&
            (Hd(r || null, n),
            pD(o) && (Bd(o, n, this.callSetDisabledState), (n.control = o)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(n) {
        let r = this.form.get(n.path);
        aD(r, n), r.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let r = this.form.get(n.path);
          r && cD(r, n) && r.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        _a(this.form, this), this._oldForm && Do(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
      static ɵfac = function (r) {
        return new (r || e)(O(Ln, 10), O(wo, 10), O(df, 8));
      };
      static ɵdir = G({
        type: e,
        selectors: [["", "formGroup", ""]],
        hostBindings: function (r, o) {
          r & 1 &&
            Pe("submit", function (s) {
              return o.onSubmit(s);
            })("reset", function () {
              return o.onReset();
            });
        },
        inputs: { form: [0, "formGroup", "form"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        standalone: !1,
        features: [Ke([yD]), re, hn],
      });
    }
    return e;
  })(),
  vD = { provide: le, useExisting: _e(() => Io) },
  Io = (() => {
    class e extends gD {
      name = null;
      constructor(n, r, o) {
        super(),
          (this._parent = n),
          this._setValidators(r),
          this._setAsyncValidators(o);
      }
      _checkParentType() {
        gf(this._parent);
      }
      static ɵfac = function (r) {
        return new (r || e)(O(le, 13), O(Ln, 10), O(wo, 10));
      };
      static ɵdir = G({
        type: e,
        selectors: [["", "formGroupName", ""]],
        inputs: { name: [0, "formGroupName", "name"] },
        standalone: !1,
        features: [Ke([vD]), re],
      });
    }
    return e;
  })(),
  DD = { provide: le, useExisting: _e(() => bo) },
  bo = (() => {
    class e extends le {
      _parent;
      name = null;
      constructor(n, r, o) {
        super(),
          (this._parent = n),
          this._setValidators(r),
          this._setAsyncValidators(o);
      }
      ngOnInit() {
        this._checkParentType(), this.formDirective.addFormArray(this);
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeFormArray(this);
      }
      get control() {
        return this.formDirective.getFormArray(this);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      get path() {
        return Ca(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      _checkParentType() {
        gf(this._parent);
      }
      static ɵfac = function (r) {
        return new (r || e)(O(le, 13), O(Ln, 10), O(wo, 10));
      };
      static ɵdir = G({
        type: e,
        selectors: [["", "formArrayName", ""]],
        inputs: { name: [0, "formArrayName", "name"] },
        standalone: !1,
        features: [Ke([DD]), re],
      });
    }
    return e;
  })();
function gf(e) {
  return !(e instanceof Io) && !(e instanceof _o) && !(e instanceof bo);
}
var ED = { provide: kn, useExisting: _e(() => ba) },
  ba = (() => {
    class e extends kn {
      _ngModelWarningConfig;
      _added = !1;
      viewModel;
      control;
      name = null;
      set isDisabled(n) {}
      model;
      update = new te();
      static _ngModelWarningSentOnce = !1;
      _ngModelWarningSent = !1;
      constructor(n, r, o, i, s) {
        super(),
          (this._ngModelWarningConfig = s),
          (this._parent = n),
          this._setValidators(r),
          this._setAsyncValidators(o),
          (this.valueAccessor = fD(this, i));
      }
      ngOnChanges(n) {
        this._added || this._setUpControl(),
          uD(n, this.viewModel) &&
            ((this.viewModel = this.model),
            this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      get path() {
        return Ca(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(),
          (this.control = this.formDirective.addControl(this)),
          (this._added = !0);
      }
      static ɵfac = function (r) {
        return new (r || e)(
          O(le, 13),
          O(Ln, 10),
          O(wo, 10),
          O(va, 10),
          O(pf, 8)
        );
      };
      static ɵdir = G({
        type: e,
        selectors: [["", "formControlName", ""]],
        inputs: {
          name: [0, "formControlName", "name"],
          isDisabled: [0, "disabled", "isDisabled"],
          model: [0, "ngModel", "model"],
        },
        outputs: { update: "ngModelChange" },
        standalone: !1,
        features: [Ke([ED]), re, hn],
      });
    }
    return e;
  })();
function wD(e) {
  return typeof e == "number" ? e : parseFloat(e);
}
var CD = (() => {
  class e {
    _validator = fo;
    _onChange;
    _enabled;
    ngOnChanges(n) {
      if (this.inputName in n) {
        let r = this.normalizeInput(n[this.inputName].currentValue);
        (this._enabled = this.enabled(r)),
          (this._validator = this._enabled ? this.createValidator(r) : fo),
          this._onChange && this._onChange();
      }
    }
    validate(n) {
      return this._validator(n);
    }
    registerOnValidatorChange(n) {
      this._onChange = n;
    }
    enabled(n) {
      return n != null;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵdir = G({ type: e, features: [hn] });
  }
  return e;
})();
var _D = { provide: Ln, useExisting: _e(() => Ma), multi: !0 },
  Ma = (() => {
    class e extends CD {
      min;
      inputName = "min";
      normalizeInput = (n) => wD(n);
      createValidator = (n) => Zd(n);
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = gn(e)))(o || e);
        };
      })();
      static ɵdir = G({
        type: e,
        selectors: [
          ["input", "type", "number", "min", "", "formControlName", ""],
          ["input", "type", "number", "min", "", "formControl", ""],
          ["input", "type", "number", "min", "", "ngModel", ""],
        ],
        hostVars: 1,
        hostBindings: function (r, o) {
          r & 2 && Ys("min", o._enabled ? o.min : null);
        },
        inputs: { min: "min" },
        standalone: !1,
        features: [Ke([_D]), re],
      });
    }
    return e;
  })();
var ID = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵmod = ve({ type: e });
      static ɵinj = me({});
    }
    return e;
  })(),
  ya = class extends Gt {
    constructor(t, n, r) {
      super(Da(n), Ea(r, n)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(n),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    controls;
    at(t) {
      return this.controls[this._adjustIndex(t)];
    }
    push(t, n = {}) {
      this.controls.push(t),
        this._registerControl(t),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    insert(t, n, r = {}) {
      this.controls.splice(t, 0, n),
        this._registerControl(n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent });
    }
    removeAt(t, n = {}) {
      let r = this._adjustIndex(t);
      r < 0 && (r = 0),
        this.controls[r] &&
          this.controls[r]._registerOnCollectionChange(() => {}),
        this.controls.splice(r, 1),
        this.updateValueAndValidity({ emitEvent: n.emitEvent });
    }
    setControl(t, n, r = {}) {
      let o = this._adjustIndex(t);
      o < 0 && (o = 0),
        this.controls[o] &&
          this.controls[o]._registerOnCollectionChange(() => {}),
        this.controls.splice(o, 1),
        n && (this.controls.splice(o, 0, n), this._registerControl(n)),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    get length() {
      return this.controls.length;
    }
    setValue(t, n = {}) {
      lf(this, !1, t),
        t.forEach((r, o) => {
          uf(this, !1, o),
            this.at(o).setValue(r, { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n);
    }
    patchValue(t, n = {}) {
      t != null &&
        (t.forEach((r, o) => {
          this.at(o) &&
            this.at(o).patchValue(r, { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n));
    }
    reset(t = [], n = {}) {
      this._forEachChild((r, o) => {
        r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._updatePristine(n, this),
        this._updateTouched(n, this),
        this.updateValueAndValidity(n);
    }
    getRawValue() {
      return this.controls.map((t) => t.getRawValue());
    }
    clear(t = {}) {
      this.controls.length < 1 ||
        (this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
        this.controls.splice(0),
        this.updateValueAndValidity({ emitEvent: t.emitEvent }));
    }
    _adjustIndex(t) {
      return t < 0 ? t + this.length : t;
    }
    _syncPendingControls() {
      let t = this.controls.reduce(
        (n, r) => (r._syncPendingControls() ? !0 : n),
        !1
      );
      return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
    }
    _forEachChild(t) {
      this.controls.forEach((n, r) => {
        t(n, r);
      });
    }
    _updateValue() {
      this.value = this.controls
        .filter((t) => t.enabled || this.disabled)
        .map((t) => t.value);
    }
    _anyControls(t) {
      return this.controls.some((n) => n.enabled && t(n));
    }
    _setUpControls() {
      this._forEachChild((t) => this._registerControl(t));
    }
    _allControlsDisabled() {
      for (let t of this.controls) if (t.enabled) return !1;
      return this.controls.length > 0 || this.disabled;
    }
    _registerControl(t) {
      t.setParent(this),
        t._registerOnCollectionChange(this._onCollectionChange);
    }
    _find(t) {
      return this.at(t) ?? null;
    }
  };
function Gd(e) {
  return (
    !!e &&
    (e.asyncValidators !== void 0 ||
      e.validators !== void 0 ||
      e.updateOn !== void 0)
  );
}
var mf = (() => {
  class e {
    useNonNullable = !1;
    get nonNullable() {
      let n = new e();
      return (n.useNonNullable = !0), n;
    }
    group(n, r = null) {
      let o = this._reduceControls(n),
        i = {};
      return (
        Gd(r)
          ? (i = r)
          : r !== null &&
            ((i.validators = r.validator),
            (i.asyncValidators = r.asyncValidator)),
        new yo(o, i)
      );
    }
    record(n, r = null) {
      let o = this._reduceControls(n);
      return new ma(o, r);
    }
    control(n, r, o) {
      let i = {};
      return this.useNonNullable
        ? (Gd(r) ? (i = r) : ((i.validators = r), (i.asyncValidators = o)),
          new lo(n, P(N({}, i), { nonNullable: !0 })))
        : new lo(n, r, o);
    }
    array(n, r, o) {
      let i = n.map((s) => this._createControl(s));
      return new ya(i, r, o);
    }
    _reduceControls(n) {
      let r = {};
      return (
        Object.keys(n).forEach((o) => {
          r[o] = this._createControl(n[o]);
        }),
        r
      );
    }
    _createControl(n) {
      if (n instanceof lo) return n;
      if (n instanceof Gt) return n;
      if (Array.isArray(n)) {
        let r = n[0],
          o = n.length > 1 ? n[1] : null,
          i = n.length > 2 ? n[2] : null;
        return this.control(r, o, i);
      } else return this.control(n);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = S({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
var yf = (() => {
  class e {
    static withConfig(n) {
      return {
        ngModule: e,
        providers: [
          { provide: pf, useValue: n.warnOnNgModelWithFormControl ?? "always" },
          { provide: df, useValue: n.callSetDisabledState ?? wa },
        ],
      };
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = ve({ type: e });
    static ɵinj = me({ imports: [ID] });
  }
  return e;
})();
var zt = class e {
  http = D(oa);
  checkout(t) {
    return qo(this.http.put("/api/purchaseorder", t));
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = S({ token: e, factory: e.ɵfac });
};
function MD(e, t) {
  e & 1 && (V(0, "h3"), ue(1, "You have no items in your cart"), j());
}
function TD(e, t) {
  if (e & 1) {
    let n = td();
    V(0, "tr", 9)(1, "td"),
      Qe(2, "input", 10),
      j(),
      V(3, "td"),
      Qe(4, "input", 11),
      j(),
      V(5, "td"),
      Qe(6, "input", 12),
      j(),
      V(7, "td")(8, "button", 7),
      Pe("click", function () {
        let o = Mu(n).$index,
          i = Qs(2);
        return Tu(i.removeItem(o));
      }),
      ue(9, "X"),
      j()()();
  }
  if (e & 2) {
    let n = t.$index;
    _n("formGroupName", n);
  }
}
function SD(e, t) {
  if (
    (e & 1 &&
      (V(0, "table")(1, "thead")(2, "tr")(3, "th"),
      ue(4, "Name"),
      j(),
      V(5, "th"),
      ue(6, "Quantity"),
      j(),
      V(7, "th"),
      ue(8, "Unit price"),
      j()()(),
      V(9, "tbody", 8),
      Xl(10, TD, 10, 1, "tr", 9, Jl),
      j()()),
    e & 2)
  ) {
    let n = Qs();
    yn(10), ed(n.lineItems.controls);
  }
}
var Mo = class e {
  fb = D(mf);
  checkoutSvc = D(zt);
  orderForm;
  lineItems;
  total = 0;
  ngOnInit() {
    this.orderForm = this.createOrderForm();
  }
  addItem() {
    this.lineItems.push(this.createLineItem());
  }
  removeItem(t) {
    this.lineItems.removeAt(t);
  }
  processCheckout() {
    let t = this.orderForm.value;
    console.info("order: ", t),
      this.checkoutSvc
        .checkout(t)
        .then(() => {
          alert("Your order has been processed"),
            (this.orderForm = this.createOrderForm());
        })
        .catch((n) => alert(`ERROR: ${JSON.stringify(n)}`));
  }
  invalid() {
    return this.orderForm.invalid || this.lineItems.length <= 0;
  }
  createLineItem() {
    return this.fb.group({
      name: this.fb.control("", [Ve.required]),
      quantity: this.fb.control(1, [Ve.min(1)]),
      unitPrice: this.fb.control(0.1, [Ve.min(0.1)]),
    });
  }
  createOrderForm() {
    return (
      (this.lineItems = this.fb.array([])),
      this.fb.group({
        name: this.fb.control("", [Ve.required]),
        address: this.fb.control("", [Ve.required]),
        deliveryDate: this.fb.control("", [Ve.required]),
        lineItems: this.lineItems,
      })
    );
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = Gl({
    type: e,
    selectors: [["app-root"]],
    standalone: !1,
    decls: 28,
    vars: 3,
    consts: [
      [3, "submit", "formGroup"],
      ["type", "text", "size", "30", "formControlName", "name"],
      ["type", "text", "size", "30", "formControlName", "address"],
      ["type", "date", "size", "30", "formControlName", "deliveryDate"],
      ["colspan", "2"],
      [1, "apart"],
      ["type", "submit", 3, "disabled"],
      ["type", "button", 3, "click"],
      ["formArrayName", "lineItems"],
      [3, "formGroupName"],
      ["type", "text", "size", "20", "formControlName", "name"],
      ["type", "number", "formControlName", "quantity", "min", "1"],
      [
        "type",
        "number",
        "size",
        "10",
        "formControlName",
        "unitPrice",
        "min",
        "0.1",
        "step",
        "0.1",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (V(0, "h1"),
        ue(1, "Yet Another Shopping Cart"),
        j(),
        V(2, "form", 0),
        Pe("submit", function () {
          return r.processCheckout();
        }),
        V(3, "table")(4, "tr")(5, "td"),
        ue(6, "Name:"),
        j(),
        V(7, "td"),
        Qe(8, "input", 1),
        j()(),
        V(9, "tr")(10, "td"),
        ue(11, "Address:"),
        j(),
        V(12, "td"),
        Qe(13, "input", 2),
        j()(),
        V(14, "tr")(15, "td"),
        ue(16, "Delivery date:"),
        j(),
        V(17, "td"),
        Qe(18, "input", 3),
        j()(),
        V(19, "tr")(20, "td", 4)(21, "div", 5)(22, "button", 6),
        ue(23, "Checkout"),
        j(),
        V(24, "button", 7),
        Pe("click", function () {
          return r.addItem();
        }),
        ue(25, "Add Item"),
        j()()()()(),
        Ws(26, MD, 2, 0, "h3")(27, SD, 12, 0, "table"),
        j()),
        n & 2 &&
          (yn(2),
          _n("formGroup", r.orderForm),
          yn(20),
          _n("disabled", r.invalid()),
          yn(4),
          Kl(r.lineItems.length <= 0 ? 26 : 27));
    },
    dependencies: [hf, Eo, Ia, af, cf, Ma, _o, ba, Io, bo],
    encapsulation: 2,
  });
};
var To = class e {
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵmod = ve({ type: e, bootstrap: [Mo] });
  static ɵinj = me({ providers: [bd(), zt], imports: [kd, yf] });
};
Pd()
  .bootstrapModule(To, { ngZoneEventCoalescing: !0 })
  .catch((e) => console.error(e));
