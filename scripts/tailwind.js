(() => {
  var Hb = Object.create;
  var ii = Object.defineProperty;
  var Yb = Object.getOwnPropertyDescriptor;
  var Qb = Object.getOwnPropertyNames;
  var Jb = Object.getPrototypeOf,
    Xb = Object.prototype.hasOwnProperty;
  var Hl = (r) => ii(r, '__esModule', { value: !0 });
  var Yl = (r) => {
    if (typeof require != 'undefined') return require(r);
    throw new Error('Dynamic require of "' + r + '" is not supported');
  };
  var C = (r, e) => () => (r && (e = r((r = 0))), e);
  var v = (r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports),
    Ce = (r, e) => {
      Hl(r);
      for (var t in e) ii(r, t, { get: e[t], enumerable: !0 });
    },
    Kb = (r, e, t) => {
      if ((e && typeof e == 'object') || typeof e == 'function')
        for (let i of Qb(e))
          !Xb.call(r, i) &&
            i !== 'default' &&
            ii(r, i, {
              get: () => e[i],
              enumerable: !(t = Yb(e, i)) || t.enumerable,
            });
      return r;
    },
    K = (r) =>
      Kb(
        Hl(
          ii(
            r != null ? Hb(Jb(r)) : {},
            'default',
            r && r.__esModule && 'default' in r
              ? { get: () => r.default, enumerable: !0 }
              : { value: r, enumerable: !0 }
          )
        ),
        r
      );
  var m,
    l = C(() => {
      m = { platform: '', env: {}, versions: { node: '14.17.6' } };
    });
  var Zb,
    ie,
    je = C(() => {
      l();
      (Zb = 0),
        (ie = {
          readFileSync: (r) => self[r] || '',
          statSync: () => ({ mtimeMs: Zb++ }),
        });
    });
  var zn = v((pE, Jl) => {
    l();
    ('use strict');
    var Ql = class {
      constructor(e = {}) {
        if (!(e.maxSize && e.maxSize > 0))
          throw new TypeError('`maxSize` must be a number greater than 0');
        if (typeof e.maxAge == 'number' && e.maxAge === 0)
          throw new TypeError('`maxAge` must be a number greater than 0');
        (this.maxSize = e.maxSize),
          (this.maxAge = e.maxAge || 1 / 0),
          (this.onEviction = e.onEviction),
          (this.cache = new Map()),
          (this.oldCache = new Map()),
          (this._size = 0);
      }
      _emitEvictions(e) {
        if (typeof this.onEviction == 'function')
          for (let [t, i] of e) this.onEviction(t, i.value);
      }
      _deleteIfExpired(e, t) {
        return typeof t.expiry == 'number' && t.expiry <= Date.now()
          ? (typeof this.onEviction == 'function' &&
              this.onEviction(e, t.value),
            this.delete(e))
          : !1;
      }
      _getOrDeleteIfExpired(e, t) {
        if (this._deleteIfExpired(e, t) === !1) return t.value;
      }
      _getItemValue(e, t) {
        return t.expiry ? this._getOrDeleteIfExpired(e, t) : t.value;
      }
      _peek(e, t) {
        let i = t.get(e);
        return this._getItemValue(e, i);
      }
      _set(e, t) {
        this.cache.set(e, t),
          this._size++,
          this._size >= this.maxSize &&
            ((this._size = 0),
            this._emitEvictions(this.oldCache),
            (this.oldCache = this.cache),
            (this.cache = new Map()));
      }
      _moveToRecent(e, t) {
        this.oldCache.delete(e), this._set(e, t);
      }
      *_entriesAscending() {
        for (let e of this.oldCache) {
          let [t, i] = e;
          this.cache.has(t) ||
            (this._deleteIfExpired(t, i) === !1 && (yield e));
        }
        for (let e of this.cache) {
          let [t, i] = e;
          this._deleteIfExpired(t, i) === !1 && (yield e);
        }
      }
      get(e) {
        if (this.cache.has(e)) {
          let t = this.cache.get(e);
          return this._getItemValue(e, t);
        }
        if (this.oldCache.has(e)) {
          let t = this.oldCache.get(e);
          if (this._deleteIfExpired(e, t) === !1)
            return this._moveToRecent(e, t), t.value;
        }
      }
      set(
        e,
        t,
        {
          maxAge: i = this.maxAge === 1 / 0 ? void 0 : Date.now() + this.maxAge,
        } = {}
      ) {
        this.cache.has(e)
          ? this.cache.set(e, { value: t, maxAge: i })
          : this._set(e, { value: t, expiry: i });
      }
      has(e) {
        return this.cache.has(e)
          ? !this._deleteIfExpired(e, this.cache.get(e))
          : this.oldCache.has(e)
          ? !this._deleteIfExpired(e, this.oldCache.get(e))
          : !1;
      }
      peek(e) {
        if (this.cache.has(e)) return this._peek(e, this.cache);
        if (this.oldCache.has(e)) return this._peek(e, this.oldCache);
      }
      delete(e) {
        let t = this.cache.delete(e);
        return t && this._size--, this.oldCache.delete(e) || t;
      }
      clear() {
        this.cache.clear(), this.oldCache.clear(), (this._size = 0);
      }
      resize(e) {
        if (!(e && e > 0))
          throw new TypeError('`maxSize` must be a number greater than 0');
        let t = [...this._entriesAscending()],
          i = t.length - e;
        i < 0
          ? ((this.cache = new Map(t)),
            (this.oldCache = new Map()),
            (this._size = t.length))
          : (i > 0 && this._emitEvictions(t.slice(0, i)),
            (this.oldCache = new Map(t.slice(i))),
            (this.cache = new Map()),
            (this._size = 0)),
          (this.maxSize = e);
      }
      *keys() {
        for (let [e] of this) yield e;
      }
      *values() {
        for (let [, e] of this) yield e;
      }
      *[Symbol.iterator]() {
        for (let e of this.cache) {
          let [t, i] = e;
          this._deleteIfExpired(t, i) === !1 && (yield [t, i.value]);
        }
        for (let e of this.oldCache) {
          let [t, i] = e;
          this.cache.has(t) ||
            (this._deleteIfExpired(t, i) === !1 && (yield [t, i.value]));
        }
      }
      *entriesDescending() {
        let e = [...this.cache];
        for (let t = e.length - 1; t >= 0; --t) {
          let i = e[t],
            [n, s] = i;
          this._deleteIfExpired(n, s) === !1 && (yield [n, s.value]);
        }
        e = [...this.oldCache];
        for (let t = e.length - 1; t >= 0; --t) {
          let i = e[t],
            [n, s] = i;
          this.cache.has(n) ||
            (this._deleteIfExpired(n, s) === !1 && (yield [n, s.value]));
        }
      }
      *entriesAscending() {
        for (let [e, t] of this._entriesAscending()) yield [e, t.value];
      }
      get size() {
        if (!this._size) return this.oldCache.size;
        let e = 0;
        for (let t of this.oldCache.keys()) this.cache.has(t) || e++;
        return Math.min(this._size + e, this.maxSize);
      }
    };
    Jl.exports = Ql;
  });
  var Xl,
    Kl = C(() => {
      l();
      Xl = (r) => r && r._hash;
    });
  function ni(r) {
    return Xl(r, { ignoreUnknown: !0 });
  }
  var Zl = C(() => {
    l();
    Kl();
  });
  function Je(r) {
    if (((r = `${r}`), r === '0')) return '0';
    if (/^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|\w+)?$/.test(r))
      return r.replace(/^[+-]?/, (t) => (t === '-' ? '' : '-'));
    let e = ['var', 'calc', 'min', 'max', 'clamp'];
    for (let t of e) if (r.includes(`${t}(`)) return `calc(${r} * -1)`;
  }
  var si = C(() => {
    l();
  });
  var eu,
    tu = C(() => {
      l();
      eu = [
        'preflight',
        'container',
        'accessibility',
        'pointerEvents',
        'visibility',
        'position',
        'inset',
        'isolation',
        'zIndex',
        'order',
        'gridColumn',
        'gridColumnStart',
        'gridColumnEnd',
        'gridRow',
        'gridRowStart',
        'gridRowEnd',
        'float',
        'clear',
        'margin',
        'boxSizing',
        'lineClamp',
        'display',
        'aspectRatio',
        'height',
        'maxHeight',
        'minHeight',
        'width',
        'minWidth',
        'maxWidth',
        'flex',
        'flexShrink',
        'flexGrow',
        'flexBasis',
        'tableLayout',
        'captionSide',
        'borderCollapse',
        'borderSpacing',
        'transformOrigin',
        'translate',
        'rotate',
        'skew',
        'scale',
        'transform',
        'animation',
        'cursor',
        'touchAction',
        'userSelect',
        'resize',
        'scrollSnapType',
        'scrollSnapAlign',
        'scrollSnapStop',
        'scrollMargin',
        'scrollPadding',
        'listStylePosition',
        'listStyleType',
        'listStyleImage',
        'appearance',
        'columns',
        'breakBefore',
        'breakInside',
        'breakAfter',
        'gridAutoColumns',
        'gridAutoFlow',
        'gridAutoRows',
        'gridTemplateColumns',
        'gridTemplateRows',
        'flexDirection',
        'flexWrap',
        'placeContent',
        'placeItems',
        'alignContent',
        'alignItems',
        'justifyContent',
        'justifyItems',
        'gap',
        'space',
        'divideWidth',
        'divideStyle',
        'divideColor',
        'divideOpacity',
        'placeSelf',
        'alignSelf',
        'justifySelf',
        'overflow',
        'overscrollBehavior',
        'scrollBehavior',
        'textOverflow',
        'hyphens',
        'whitespace',
        'wordBreak',
        'borderRadius',
        'borderWidth',
        'borderStyle',
        'borderColor',
        'borderOpacity',
        'backgroundColor',
        'backgroundOpacity',
        'backgroundImage',
        'gradientColorStops',
        'boxDecorationBreak',
        'backgroundSize',
        'backgroundAttachment',
        'backgroundClip',
        'backgroundPosition',
        'backgroundRepeat',
        'backgroundOrigin',
        'fill',
        'stroke',
        'strokeWidth',
        'objectFit',
        'objectPosition',
        'padding',
        'textAlign',
        'textIndent',
        'verticalAlign',
        'fontFamily',
        'fontSize',
        'fontWeight',
        'textTransform',
        'fontStyle',
        'fontVariantNumeric',
        'lineHeight',
        'letterSpacing',
        'textColor',
        'textOpacity',
        'textDecoration',
        'textDecorationColor',
        'textDecorationStyle',
        'textDecorationThickness',
        'textUnderlineOffset',
        'fontSmoothing',
        'placeholderColor',
        'placeholderOpacity',
        'caretColor',
        'accentColor',
        'opacity',
        'backgroundBlendMode',
        'mixBlendMode',
        'boxShadow',
        'boxShadowColor',
        'outlineStyle',
        'outlineWidth',
        'outlineOffset',
        'outlineColor',
        'ringWidth',
        'ringColor',
        'ringOpacity',
        'ringOffsetWidth',
        'ringOffsetColor',
        'blur',
        'brightness',
        'contrast',
        'dropShadow',
        'grayscale',
        'hueRotate',
        'invert',
        'saturate',
        'sepia',
        'filter',
        'backdropBlur',
        'backdropBrightness',
        'backdropContrast',
        'backdropGrayscale',
        'backdropHueRotate',
        'backdropInvert',
        'backdropOpacity',
        'backdropSaturate',
        'backdropSepia',
        'backdropFilter',
        'transitionProperty',
        'transitionDelay',
        'transitionDuration',
        'transitionTimingFunction',
        'willChange',
        'content',
      ];
    });
  function ru(r, e) {
    return r === void 0
      ? e
      : Array.isArray(r)
      ? r
      : [
          ...new Set(
            e
              .filter((i) => r !== !1 && r[i] !== !1)
              .concat(Object.keys(r).filter((i) => r[i] !== !1))
          ),
        ];
  }
  var iu = C(() => {
    l();
  });
  var nu = {};
  Ce(nu, { default: () => Ae });
  var Ae,
    ai = C(() => {
      l();
      Ae = new Proxy({}, { get: () => String });
    });
  function Vn(r, e, t) {
    (typeof m != 'undefined' && m.env.JEST_WORKER_ID) ||
      (t && su.has(t)) ||
      (t && su.add(t),
      console.warn(''),
      e.forEach((i) => console.warn(r, '-', i)));
  }
  function Un(r) {
    return Ae.dim(r);
  }
  var su,
    N,
    Oe = C(() => {
      l();
      ai();
      su = new Set();
      N = {
        info(r, e) {
          Vn(Ae.bold(Ae.cyan('info')), ...(Array.isArray(r) ? [r] : [e, r]));
        },
        warn(r, e) {
          Vn(Ae.bold(Ae.yellow('warn')), ...(Array.isArray(r) ? [r] : [e, r]));
        },
        risk(r, e) {
          Vn(Ae.bold(Ae.magenta('risk')), ...(Array.isArray(r) ? [r] : [e, r]));
        },
      };
    });
  var au = {};
  Ce(au, { default: () => Wn });
  function rr({ version: r, from: e, to: t }) {
    N.warn(`${e}-color-renamed`, [
      `As of Tailwind CSS ${r}, \`${e}\` has been renamed to \`${t}\`.`,
      'Update your configuration file to silence this warning.',
    ]);
  }
  var Wn,
    Gn = C(() => {
      l();
      Oe();
      Wn = {
        inherit: 'inherit',
        current: 'currentColor',
        transparent: 'transparent',
        black: '#000',
        white: '#fff',
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        lime: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
          950: '#1a2e05',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        fuchsia: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        get lightBlue() {
          return (
            rr({ version: 'v2.2', from: 'lightBlue', to: 'sky' }), this.sky
          );
        },
        get warmGray() {
          return (
            rr({ version: 'v3.0', from: 'warmGray', to: 'stone' }), this.stone
          );
        },
        get trueGray() {
          return (
            rr({ version: 'v3.0', from: 'trueGray', to: 'neutral' }),
            this.neutral
          );
        },
        get coolGray() {
          return (
            rr({ version: 'v3.0', from: 'coolGray', to: 'gray' }), this.gray
          );
        },
        get blueGray() {
          return (
            rr({ version: 'v3.0', from: 'blueGray', to: 'slate' }), this.slate
          );
        },
      };
    });
  function Hn(r, ...e) {
    for (let t of e) {
      for (let i in t) r?.hasOwnProperty?.(i) || (r[i] = t[i]);
      for (let i of Object.getOwnPropertySymbols(t))
        r?.hasOwnProperty?.(i) || (r[i] = t[i]);
    }
    return r;
  }
  var ou = C(() => {
    l();
  });
  function Xe(r) {
    if (Array.isArray(r)) return r;
    let e = r.split('[').length - 1,
      t = r.split(']').length - 1;
    if (e !== t)
      throw new Error(`Path is invalid. Has unbalanced brackets: ${r}`);
    return r.split(/\.(?![^\[]*\])|[\[\]]/g).filter(Boolean);
  }
  var oi = C(() => {
    l();
  });
  function J(r, e) {
    return li.future.includes(e)
      ? r.future === 'all' || (r?.future?.[e] ?? lu[e] ?? !1)
      : li.experimental.includes(e)
      ? r.experimental === 'all' || (r?.experimental?.[e] ?? lu[e] ?? !1)
      : !1;
  }
  function uu(r) {
    return r.experimental === 'all'
      ? li.experimental
      : Object.keys(r?.experimental ?? {}).filter(
          (e) => li.experimental.includes(e) && r.experimental[e]
        );
  }
  function fu(r) {
    if (m.env.JEST_WORKER_ID === void 0 && uu(r).length > 0) {
      let e = uu(r)
        .map((t) => Ae.yellow(t))
        .join(', ');
      N.warn('experimental-flags-enabled', [
        `You have enabled experimental features: ${e}`,
        'Experimental features in Tailwind CSS are not covered by semver, may introduce breaking changes, and can change at any time.',
      ]);
    }
  }
  var lu,
    li,
    De = C(() => {
      l();
      ai();
      Oe();
      (lu = {
        optimizeUniversalDefaults: !1,
        generalizedModifiers: !0,
        get disableColorOpacityUtilitiesByDefault() {
          return !1;
        },
        get relativeContentPathsByDefault() {
          return !1;
        },
      }),
        (li = {
          future: [
            'hoverOnlyWhenSupported',
            'respectDefaultRingColorOpacity',
            'disableColorOpacityUtilitiesByDefault',
            'relativeContentPathsByDefault',
          ],
          experimental: ['optimizeUniversalDefaults', 'generalizedModifiers'],
        });
    });
  function cu(r) {
    (() => {
      if (
        r.purge ||
        !r.content ||
        (!Array.isArray(r.content) &&
          !(typeof r.content == 'object' && r.content !== null))
      )
        return !1;
      if (Array.isArray(r.content))
        return r.content.every((t) =>
          typeof t == 'string'
            ? !0
            : !(
                typeof t?.raw != 'string' ||
                (t?.extension && typeof t?.extension != 'string')
              )
        );
      if (typeof r.content == 'object' && r.content !== null) {
        if (
          Object.keys(r.content).some(
            (t) => !['files', 'relative', 'extract', 'transform'].includes(t)
          )
        )
          return !1;
        if (Array.isArray(r.content.files)) {
          if (
            !r.content.files.every((t) =>
              typeof t == 'string'
                ? !0
                : !(
                    typeof t?.raw != 'string' ||
                    (t?.extension && typeof t?.extension != 'string')
                  )
            )
          )
            return !1;
          if (typeof r.content.extract == 'object') {
            for (let t of Object.values(r.content.extract))
              if (typeof t != 'function') return !1;
          } else if (
            !(
              r.content.extract === void 0 ||
              typeof r.content.extract == 'function'
            )
          )
            return !1;
          if (typeof r.content.transform == 'object') {
            for (let t of Object.values(r.content.transform))
              if (typeof t != 'function') return !1;
          } else if (
            !(
              r.content.transform === void 0 ||
              typeof r.content.transform == 'function'
            )
          )
            return !1;
          if (
            typeof r.content.relative != 'boolean' &&
            typeof r.content.relative != 'undefined'
          )
            return !1;
        }
        return !0;
      }
      return !1;
    })() ||
      N.warn('purge-deprecation', [
        'The `purge`/`content` options have changed in Tailwind CSS v3.0.',
        'Update your configuration file to eliminate this warning.',
        'https://tailwindcss.com/docs/upgrade-guide#configure-content-sources',
      ]),
      (r.safelist = (() => {
        let { content: t, purge: i, safelist: n } = r;
        return Array.isArray(n)
          ? n
          : Array.isArray(t?.safelist)
          ? t.safelist
          : Array.isArray(i?.safelist)
          ? i.safelist
          : Array.isArray(i?.options?.safelist)
          ? i.options.safelist
          : [];
      })()),
      (r.blocklist = (() => {
        let { blocklist: t } = r;
        if (Array.isArray(t)) {
          if (t.every((i) => typeof i == 'string')) return t;
          N.warn('blocklist-invalid', [
            'The `blocklist` option must be an array of strings.',
            'https://tailwindcss.com/docs/content-configuration#discarding-classes',
          ]);
        }
        return [];
      })()),
      typeof r.prefix == 'function'
        ? (N.warn('prefix-function', [
            'As of Tailwind CSS v3.0, `prefix` cannot be a function.',
            'Update `prefix` in your configuration to be a string to eliminate this warning.',
            'https://tailwindcss.com/docs/upgrade-guide#prefix-cannot-be-a-function',
          ]),
          (r.prefix = ''))
        : (r.prefix = r.prefix ?? ''),
      (r.content = {
        relative: (() => {
          let { content: t } = r;
          return t?.relative
            ? t.relative
            : J(r, 'relativeContentPathsByDefault');
        })(),
        files: (() => {
          let { content: t, purge: i } = r;
          return Array.isArray(i)
            ? i
            : Array.isArray(i?.content)
            ? i.content
            : Array.isArray(t)
            ? t
            : Array.isArray(t?.content)
            ? t.content
            : Array.isArray(t?.files)
            ? t.files
            : [];
        })(),
        extract: (() => {
          let t = (() =>
              r.purge?.extract
                ? r.purge.extract
                : r.content?.extract
                ? r.content.extract
                : r.purge?.extract?.DEFAULT
                ? r.purge.extract.DEFAULT
                : r.content?.extract?.DEFAULT
                ? r.content.extract.DEFAULT
                : r.purge?.options?.extractors
                ? r.purge.options.extractors
                : r.content?.options?.extractors
                ? r.content.options.extractors
                : {})(),
            i = {},
            n = (() => {
              if (r.purge?.options?.defaultExtractor)
                return r.purge.options.defaultExtractor;
              if (r.content?.options?.defaultExtractor)
                return r.content.options.defaultExtractor;
            })();
          if ((n !== void 0 && (i.DEFAULT = n), typeof t == 'function'))
            i.DEFAULT = t;
          else if (Array.isArray(t))
            for (let { extensions: s, extractor: a } of t ?? [])
              for (let o of s) i[o] = a;
          else typeof t == 'object' && t !== null && Object.assign(i, t);
          return i;
        })(),
        transform: (() => {
          let t = (() =>
              r.purge?.transform
                ? r.purge.transform
                : r.content?.transform
                ? r.content.transform
                : r.purge?.transform?.DEFAULT
                ? r.purge.transform.DEFAULT
                : r.content?.transform?.DEFAULT
                ? r.content.transform.DEFAULT
                : {})(),
            i = {};
          return (
            typeof t == 'function' && (i.DEFAULT = t),
            typeof t == 'object' && t !== null && Object.assign(i, t),
            i
          );
        })(),
      });
    for (let t of r.content.files)
      if (typeof t == 'string' && /{([^,]*?)}/g.test(t)) {
        N.warn('invalid-glob-braces', [
          `The glob pattern ${Un(
            t
          )} in your Tailwind CSS configuration is invalid.`,
          `Update it to ${Un(
            t.replace(/{([^,]*?)}/g, '$1')
          )} to silence this warning.`,
        ]);
        break;
      }
    return r;
  }
  var pu = C(() => {
    l();
    De();
    Oe();
  });
  function se(r) {
    if (Object.prototype.toString.call(r) !== '[object Object]') return !1;
    let e = Object.getPrototypeOf(r);
    return e === null || e === Object.prototype;
  }
  var vt = C(() => {
    l();
  });
  function Ke(r) {
    return Array.isArray(r)
      ? r.map((e) => Ke(e))
      : typeof r == 'object' && r !== null
      ? Object.fromEntries(Object.entries(r).map(([e, t]) => [e, Ke(t)]))
      : r;
  }
  var ui = C(() => {
    l();
  });
  function pt(r) {
    return r.replace(/\\,/g, '\\2c ');
  }
  var fi = C(() => {
    l();
  });
  var Yn,
    du = C(() => {
      l();
      Yn = {
        aliceblue: [240, 248, 255],
        antiquewhite: [250, 235, 215],
        aqua: [0, 255, 255],
        aquamarine: [127, 255, 212],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        bisque: [255, 228, 196],
        black: [0, 0, 0],
        blanchedalmond: [255, 235, 205],
        blue: [0, 0, 255],
        blueviolet: [138, 43, 226],
        brown: [165, 42, 42],
        burlywood: [222, 184, 135],
        cadetblue: [95, 158, 160],
        chartreuse: [127, 255, 0],
        chocolate: [210, 105, 30],
        coral: [255, 127, 80],
        cornflowerblue: [100, 149, 237],
        cornsilk: [255, 248, 220],
        crimson: [220, 20, 60],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgoldenrod: [184, 134, 11],
        darkgray: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkgrey: [169, 169, 169],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkseagreen: [143, 188, 143],
        darkslateblue: [72, 61, 139],
        darkslategray: [47, 79, 79],
        darkslategrey: [47, 79, 79],
        darkturquoise: [0, 206, 209],
        darkviolet: [148, 0, 211],
        deeppink: [255, 20, 147],
        deepskyblue: [0, 191, 255],
        dimgray: [105, 105, 105],
        dimgrey: [105, 105, 105],
        dodgerblue: [30, 144, 255],
        firebrick: [178, 34, 34],
        floralwhite: [255, 250, 240],
        forestgreen: [34, 139, 34],
        fuchsia: [255, 0, 255],
        gainsboro: [220, 220, 220],
        ghostwhite: [248, 248, 255],
        gold: [255, 215, 0],
        goldenrod: [218, 165, 32],
        gray: [128, 128, 128],
        green: [0, 128, 0],
        greenyellow: [173, 255, 47],
        grey: [128, 128, 128],
        honeydew: [240, 255, 240],
        hotpink: [255, 105, 180],
        indianred: [205, 92, 92],
        indigo: [75, 0, 130],
        ivory: [255, 255, 240],
        khaki: [240, 230, 140],
        lavender: [230, 230, 250],
        lavenderblush: [255, 240, 245],
        lawngreen: [124, 252, 0],
        lemonchiffon: [255, 250, 205],
        lightblue: [173, 216, 230],
        lightcoral: [240, 128, 128],
        lightcyan: [224, 255, 255],
        lightgoldenrodyellow: [250, 250, 210],
        lightgray: [211, 211, 211],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightsalmon: [255, 160, 122],
        lightseagreen: [32, 178, 170],
        lightskyblue: [135, 206, 250],
        lightslategray: [119, 136, 153],
        lightslategrey: [119, 136, 153],
        lightsteelblue: [176, 196, 222],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        limegreen: [50, 205, 50],
        linen: [250, 240, 230],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        mediumaquamarine: [102, 205, 170],
        mediumblue: [0, 0, 205],
        mediumorchid: [186, 85, 211],
        mediumpurple: [147, 112, 219],
        mediumseagreen: [60, 179, 113],
        mediumslateblue: [123, 104, 238],
        mediumspringgreen: [0, 250, 154],
        mediumturquoise: [72, 209, 204],
        mediumvioletred: [199, 21, 133],
        midnightblue: [25, 25, 112],
        mintcream: [245, 255, 250],
        mistyrose: [255, 228, 225],
        moccasin: [255, 228, 181],
        navajowhite: [255, 222, 173],
        navy: [0, 0, 128],
        oldlace: [253, 245, 230],
        olive: [128, 128, 0],
        olivedrab: [107, 142, 35],
        orange: [255, 165, 0],
        orangered: [255, 69, 0],
        orchid: [218, 112, 214],
        palegoldenrod: [238, 232, 170],
        palegreen: [152, 251, 152],
        paleturquoise: [175, 238, 238],
        palevioletred: [219, 112, 147],
        papayawhip: [255, 239, 213],
        peachpuff: [255, 218, 185],
        peru: [205, 133, 63],
        pink: [255, 192, 203],
        plum: [221, 160, 221],
        powderblue: [176, 224, 230],
        purple: [128, 0, 128],
        rebeccapurple: [102, 51, 153],
        red: [255, 0, 0],
        rosybrown: [188, 143, 143],
        royalblue: [65, 105, 225],
        saddlebrown: [139, 69, 19],
        salmon: [250, 128, 114],
        sandybrown: [244, 164, 96],
        seagreen: [46, 139, 87],
        seashell: [255, 245, 238],
        sienna: [160, 82, 45],
        silver: [192, 192, 192],
        skyblue: [135, 206, 235],
        slateblue: [106, 90, 205],
        slategray: [112, 128, 144],
        slategrey: [112, 128, 144],
        snow: [255, 250, 250],
        springgreen: [0, 255, 127],
        steelblue: [70, 130, 180],
        tan: [210, 180, 140],
        teal: [0, 128, 128],
        thistle: [216, 191, 216],
        tomato: [255, 99, 71],
        turquoise: [64, 224, 208],
        violet: [238, 130, 238],
        wheat: [245, 222, 179],
        white: [255, 255, 255],
        whitesmoke: [245, 245, 245],
        yellow: [255, 255, 0],
        yellowgreen: [154, 205, 50],
      };
    });
  function ir(r, { loose: e = !1 } = {}) {
    if (typeof r != 'string') return null;
    if (((r = r.trim()), r === 'transparent'))
      return { mode: 'rgb', color: ['0', '0', '0'], alpha: '0' };
    if (r in Yn) return { mode: 'rgb', color: Yn[r].map((s) => s.toString()) };
    let t = r
      .replace(tw, (s, a, o, u, c) =>
        ['#', a, a, o, o, u, u, c ? c + c : ''].join('')
      )
      .match(ew);
    if (t !== null)
      return {
        mode: 'rgb',
        color: [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)].map(
          (s) => s.toString()
        ),
        alpha: t[4] ? (parseInt(t[4], 16) / 255).toString() : void 0,
      };
    let i = r.match(rw) ?? r.match(iw);
    if (i === null) return null;
    let n = [i[2], i[3], i[4]].filter(Boolean).map((s) => s.toString());
    return n.length === 2 && n[0].startsWith('var(')
      ? { mode: i[1], color: [n[0]], alpha: n[1] }
      : (!e && n.length !== 3) ||
        (n.length < 3 && !n.some((s) => /^var\(.*?\)$/.test(s)))
      ? null
      : { mode: i[1], color: n, alpha: i[5]?.toString?.() };
  }
  function Qn({ mode: r, color: e, alpha: t }) {
    let i = t !== void 0;
    return r === 'rgba' || r === 'hsla'
      ? `${r}(${e.join(', ')}${i ? `, ${t}` : ''})`
      : `${r}(${e.join(' ')}${i ? ` / ${t}` : ''})`;
  }
  var ew,
    tw,
    Ze,
    ci,
    hu,
    et,
    rw,
    iw,
    Jn = C(() => {
      l();
      du();
      (ew = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i),
        (tw = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i),
        (Ze = /(?:\d+|\d*\.\d+)%?/),
        (ci = /(?:\s*,\s*|\s+)/),
        (hu = /\s*[,/]\s*/),
        (et = /var\(--(?:[^ )]*?)\)/),
        (rw = new RegExp(
          `^(rgba?)\\(\\s*(${Ze.source}|${et.source})(?:${ci.source}(${Ze.source}|${et.source}))?(?:${ci.source}(${Ze.source}|${et.source}))?(?:${hu.source}(${Ze.source}|${et.source}))?\\s*\\)$`
        )),
        (iw = new RegExp(
          `^(hsla?)\\(\\s*((?:${Ze.source})(?:deg|rad|grad|turn)?|${et.source})(?:${ci.source}(${Ze.source}|${et.source}))?(?:${ci.source}(${Ze.source}|${et.source}))?(?:${hu.source}(${Ze.source}|${et.source}))?\\s*\\)$`
        ));
    });
  function Ie(r, e, t) {
    if (typeof r == 'function') return r({ opacityValue: e });
    let i = ir(r, { loose: !0 });
    return i === null ? t : Qn({ ...i, alpha: e });
  }
  function oe({ color: r, property: e, variable: t }) {
    let i = [].concat(e);
    if (typeof r == 'function')
      return {
        [t]: '1',
        ...Object.fromEntries(
          i.map((s) => [
            s,
            r({ opacityVariable: t, opacityValue: `var(${t})` }),
          ])
        ),
      };
    let n = ir(r);
    return n === null
      ? Object.fromEntries(i.map((s) => [s, r]))
      : n.alpha !== void 0
      ? Object.fromEntries(i.map((s) => [s, r]))
      : {
          [t]: '1',
          ...Object.fromEntries(
            i.map((s) => [s, Qn({ ...n, alpha: `var(${t})` })])
          ),
        };
  }
  var nr = C(() => {
    l();
    Jn();
  });
  function le(r, e) {
    let t = [],
      i = [],
      n = 0,
      s = !1;
    for (let a = 0; a < r.length; a++) {
      let o = r[a];
      t.length === 0 &&
        o === e[0] &&
        !s &&
        (e.length === 1 || r.slice(a, a + e.length) === e) &&
        (i.push(r.slice(n, a)), (n = a + e.length)),
        s ? (s = !1) : o === '\\' && (s = !0),
        o === '(' || o === '[' || o === '{'
          ? t.push(o)
          : ((o === ')' && t[t.length - 1] === '(') ||
              (o === ']' && t[t.length - 1] === '[') ||
              (o === '}' && t[t.length - 1] === '{')) &&
            t.pop();
    }
    return i.push(r.slice(n)), i;
  }
  var sr = C(() => {
    l();
  });
  function pi(r) {
    return le(r, ',').map((t) => {
      let i = t.trim(),
        n = { raw: i },
        s = i.split(sw),
        a = new Set();
      for (let o of s)
        (mu.lastIndex = 0),
          !a.has('KEYWORD') && nw.has(o)
            ? ((n.keyword = o), a.add('KEYWORD'))
            : mu.test(o)
            ? a.has('X')
              ? a.has('Y')
                ? a.has('BLUR')
                  ? a.has('SPREAD') || ((n.spread = o), a.add('SPREAD'))
                  : ((n.blur = o), a.add('BLUR'))
                : ((n.y = o), a.add('Y'))
              : ((n.x = o), a.add('X'))
            : n.color
            ? (n.unknown || (n.unknown = []), n.unknown.push(o))
            : (n.color = o);
      return (n.valid = n.x !== void 0 && n.y !== void 0), n;
    });
  }
  function gu(r) {
    return r
      .map((e) =>
        e.valid
          ? [e.keyword, e.x, e.y, e.blur, e.spread, e.color]
              .filter(Boolean)
              .join(' ')
          : e.raw
      )
      .join(', ');
  }
  var nw,
    sw,
    mu,
    Xn = C(() => {
      l();
      sr();
      (nw = new Set(['inset', 'inherit', 'initial', 'revert', 'unset'])),
        (sw = /\ +(?![^(]*\))/g),
        (mu = /^-?(\d+|\.\d+)(.*?)$/g);
    });
  function Kn(r) {
    return aw.some((e) => new RegExp(`^${e}\\(.*\\)`).test(r));
  }
  function V(r, e = !0) {
    return r.startsWith('--')
      ? `var(${r})`
      : r.includes('url(')
      ? r
          .split(/(url\(.*?\))/g)
          .filter(Boolean)
          .map((t) => (/^url\(.*?\)$/.test(t) ? t : V(t, !1)))
          .join('')
      : ((r = r
          .replace(/([^\\])_+/g, (t, i) => i + ' '.repeat(t.length - 1))
          .replace(/^_/g, ' ')
          .replace(/\\_/g, '_')),
        e && (r = r.trim()),
        (r = r.replace(/(calc|min|max|clamp)\(.+\)/g, (t) => {
          let i = [];
          return t
            .replace(
              /var\((--.+?)[,)]/g,
              (n, s) => (i.push(s), n.replace(s, yu))
            )
            .replace(
              /(-?\d*\.?\d(?!\b-\d.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,
              '$1 $2 '
            )
            .replace(ow, () => i.shift());
        })),
        r);
  }
  function Zn(r) {
    return r.startsWith('url(');
  }
  function es(r) {
    return !isNaN(Number(r)) || Kn(r);
  }
  function ar(r) {
    return (r.endsWith('%') && es(r.slice(0, -1))) || Kn(r);
  }
  function or(r) {
    return (
      r === '0' ||
      new RegExp(`^[+-]?[0-9]*.?[0-9]+(?:[eE][+-]?[0-9]+)?${uw}$`).test(r) ||
      Kn(r)
    );
  }
  function bu(r) {
    return fw.has(r);
  }
  function wu(r) {
    let e = pi(V(r));
    for (let t of e) if (!t.valid) return !1;
    return !0;
  }
  function vu(r) {
    let e = 0;
    return le(r, '_').every(
      (i) => (
        (i = V(i)),
        i.startsWith('var(')
          ? !0
          : ir(i, { loose: !0 }) !== null
          ? (e++, !0)
          : !1
      )
    )
      ? e > 0
      : !1;
  }
  function xu(r) {
    let e = 0;
    return le(r, ',').every(
      (i) => (
        (i = V(i)),
        i.startsWith('var(')
          ? !0
          : Zn(i) ||
            pw(i) ||
            ['element(', 'image(', 'cross-fade(', 'image-set('].some((n) =>
              i.startsWith(n)
            )
          ? (e++, !0)
          : !1
      )
    )
      ? e > 0
      : !1;
  }
  function pw(r) {
    r = V(r);
    for (let e of cw) if (r.startsWith(`${e}(`)) return !0;
    return !1;
  }
  function ku(r) {
    let e = 0;
    return le(r, '_').every(
      (i) => (
        (i = V(i)),
        i.startsWith('var(') ? !0 : dw.has(i) || or(i) || ar(i) ? (e++, !0) : !1
      )
    )
      ? e > 0
      : !1;
  }
  function Su(r) {
    let e = 0;
    return le(r, ',').every(
      (i) => (
        (i = V(i)),
        i.startsWith('var(')
          ? !0
          : (i.includes(' ') && !/(['"])([^"']+)\1/g.test(i)) || /^\d/g.test(i)
          ? !1
          : (e++, !0)
      )
    )
      ? e > 0
      : !1;
  }
  function _u(r) {
    return hw.has(r);
  }
  function Cu(r) {
    return mw.has(r);
  }
  function Au(r) {
    return gw.has(r);
  }
  var aw,
    yu,
    ow,
    lw,
    uw,
    fw,
    cw,
    dw,
    hw,
    mw,
    gw,
    lr = C(() => {
      l();
      Jn();
      Xn();
      sr();
      aw = ['min', 'max', 'clamp', 'calc'];
      (yu = '--tw-placeholder'), (ow = new RegExp(yu, 'g'));
      (lw = [
        'cm',
        'mm',
        'Q',
        'in',
        'pc',
        'pt',
        'px',
        'em',
        'ex',
        'ch',
        'rem',
        'lh',
        'rlh',
        'vw',
        'vh',
        'vmin',
        'vmax',
        'vb',
        'vi',
        'svw',
        'svh',
        'lvw',
        'lvh',
        'dvw',
        'dvh',
        'cqw',
        'cqh',
        'cqi',
        'cqb',
        'cqmin',
        'cqmax',
      ]),
        (uw = `(?:${lw.join('|')})`);
      fw = new Set(['thin', 'medium', 'thick']);
      cw = new Set([
        'linear-gradient',
        'radial-gradient',
        'repeating-linear-gradient',
        'repeating-radial-gradient',
        'conic-gradient',
      ]);
      dw = new Set(['center', 'top', 'right', 'bottom', 'left']);
      hw = new Set([
        'serif',
        'sans-serif',
        'monospace',
        'cursive',
        'fantasy',
        'system-ui',
        'ui-serif',
        'ui-sans-serif',
        'ui-monospace',
        'ui-rounded',
        'math',
        'emoji',
        'fangsong',
      ]);
      mw = new Set([
        'xx-small',
        'x-small',
        'small',
        'medium',
        'large',
        'x-large',
        'x-large',
        'xxx-large',
      ]);
      gw = new Set(['larger', 'smaller']);
    });
  function Ou(r) {
    let e = ['cover', 'contain'];
    return le(r, ',').every((t) => {
      let i = le(t, '_').filter(Boolean);
      return i.length === 1 && e.includes(i[0])
        ? !0
        : i.length !== 1 && i.length !== 2
        ? !1
        : i.every((n) => or(n) || ar(n) || n === 'auto');
    });
  }
  var Eu = C(() => {
    l();
    lr();
    sr();
  });
  function Tu(r, e) {
    r.walkClasses((t) => {
      (t.value = e(t.value)),
        t.raws && t.raws.value && (t.raws.value = pt(t.raws.value));
    });
  }
  function Pu(r, e) {
    if (!tt(r)) return;
    let t = r.slice(1, -1);
    if (!!e(t)) return V(t);
  }
  function yw(r, e = {}, t) {
    let i = e[r];
    if (i !== void 0) return Je(i);
    if (tt(r)) {
      let n = Pu(r, t);
      return n === void 0 ? void 0 : Je(n);
    }
  }
  function di(r, e = {}, { validate: t = () => !0 } = {}) {
    let i = e.values?.[r];
    return i !== void 0
      ? i
      : e.supportsNegativeValues && r.startsWith('-')
      ? yw(r.slice(1), e.values, t)
      : Pu(r, t);
  }
  function tt(r) {
    return r.startsWith('[') && r.endsWith(']');
  }
  function Du(r) {
    let e = r.lastIndexOf('/');
    return e === -1 || e === r.length - 1
      ? [r, void 0]
      : tt(r) && !r.includes(']/[')
      ? [r, void 0]
      : [r.slice(0, e), r.slice(e + 1)];
  }
  function xt(r) {
    if (typeof r == 'string' && r.includes('<alpha-value>')) {
      let e = r;
      return ({ opacityValue: t = 1 }) => e.replace('<alpha-value>', t);
    }
    return r;
  }
  function Iu(r) {
    return V(r.slice(1, -1));
  }
  function bw(r, e = {}, { tailwindConfig: t = {} } = {}) {
    if (e.values?.[r] !== void 0) return xt(e.values?.[r]);
    let [i, n] = Du(r);
    if (n !== void 0) {
      let s = e.values?.[i] ?? (tt(i) ? i.slice(1, -1) : void 0);
      return s === void 0
        ? void 0
        : ((s = xt(s)),
          tt(n)
            ? Ie(s, Iu(n))
            : t.theme?.opacity?.[n] === void 0
            ? void 0
            : Ie(s, t.theme.opacity[n]));
    }
    return di(r, e, { validate: vu });
  }
  function ww(r, e = {}) {
    return e.values?.[r];
  }
  function he(r) {
    return (e, t) => di(e, t, { validate: r });
  }
  function vw(r, e) {
    let t = r.indexOf(e);
    return t === -1 ? [void 0, r] : [r.slice(0, t), r.slice(t + 1)];
  }
  function rs(r, e, t, i) {
    if (t.values && e in t.values)
      for (let { type: s } of r ?? []) {
        let a = ts[s](e, t, { tailwindConfig: i });
        if (a !== void 0) return [a, s, null];
      }
    if (tt(e)) {
      let s = e.slice(1, -1),
        [a, o] = vw(s, ':');
      if (!/^[\w-_]+$/g.test(a)) o = s;
      else if (a !== void 0 && !qu.includes(a)) return [];
      if (o.length > 0 && qu.includes(a)) return [di(`[${o}]`, t), a, null];
    }
    let n = is(r, e, t, i);
    for (let s of n) return s;
    return [];
  }
  function* is(r, e, t, i) {
    let n = J(i, 'generalizedModifiers'),
      [s, a] = Du(e);
    if (
      ((n &&
        t.modifiers != null &&
        (t.modifiers === 'any' ||
          (typeof t.modifiers == 'object' &&
            ((a && tt(a)) || a in t.modifiers)))) ||
        ((s = e), (a = void 0)),
      a !== void 0 && s === '' && (s = 'DEFAULT'),
      a !== void 0 && typeof t.modifiers == 'object')
    ) {
      let u = t.modifiers?.[a] ?? null;
      u !== null ? (a = u) : tt(a) && (a = Iu(a));
    }
    for (let { type: u } of r ?? []) {
      let c = ts[u](s, t, { tailwindConfig: i });
      c !== void 0 && (yield [c, u, a ?? null]);
    }
  }
  var ts,
    qu,
    ur = C(() => {
      l();
      fi();
      nr();
      lr();
      si();
      Eu();
      De();
      (ts = {
        any: di,
        color: bw,
        url: he(Zn),
        image: he(xu),
        length: he(or),
        percentage: he(ar),
        position: he(ku),
        lookup: ww,
        'generic-name': he(_u),
        'family-name': he(Su),
        number: he(es),
        'line-width': he(bu),
        'absolute-size': he(Cu),
        'relative-size': he(Au),
        shadow: he(wu),
        size: he(Ou),
      }),
        (qu = Object.keys(ts));
    });
  function L(r) {
    return typeof r == 'function' ? r({}) : r;
  }
  var ns = C(() => {
    l();
  });
  function kt(r) {
    return typeof r == 'function';
  }
  function fr(r, ...e) {
    let t = e.pop();
    for (let i of e)
      for (let n in i) {
        let s = t(r[n], i[n]);
        s === void 0
          ? se(r[n]) && se(i[n])
            ? (r[n] = fr({}, r[n], i[n], t))
            : (r[n] = i[n])
          : (r[n] = s);
      }
    return r;
  }
  function xw(r, ...e) {
    return kt(r) ? r(...e) : r;
  }
  function kw(r) {
    return r.reduce(
      (e, { extend: t }) =>
        fr(e, t, (i, n) =>
          i === void 0 ? [n] : Array.isArray(i) ? [n, ...i] : [n, i]
        ),
      {}
    );
  }
  function Sw(r) {
    return { ...r.reduce((e, t) => Hn(e, t), {}), extend: kw(r) };
  }
  function Ru(r, e) {
    if (Array.isArray(r) && se(r[0])) return r.concat(e);
    if (Array.isArray(e) && se(e[0]) && se(r)) return [r, ...e];
    if (Array.isArray(e)) return e;
  }
  function _w({ extend: r, ...e }) {
    return fr(e, r, (t, i) =>
      !kt(t) && !i.some(kt)
        ? fr({}, t, ...i, Ru)
        : (n, s) => fr({}, ...[t, ...i].map((a) => xw(a, n, s)), Ru)
    );
  }
  function* Cw(r) {
    let e = Xe(r);
    if (e.length === 0 || (yield e, Array.isArray(r))) return;
    let t = /^(.*?)\s*\/\s*([^/]+)$/,
      i = r.match(t);
    if (i !== null) {
      let [, n, s] = i,
        a = Xe(n);
      (a.alpha = s), yield a;
    }
  }
  function Aw(r) {
    let e = (t, i) => {
      for (let n of Cw(t)) {
        let s = 0,
          a = r;
        for (; a != null && s < n.length; )
          (a = a[n[s++]]),
            (a =
              kt(a) && (n.alpha === void 0 || s <= n.length - 1)
                ? a(e, ss)
                : a);
        if (a !== void 0) {
          if (n.alpha !== void 0) {
            let o = xt(a);
            return Ie(o, n.alpha, L(o));
          }
          return se(a) ? Ke(a) : a;
        }
      }
      return i;
    };
    return (
      Object.assign(e, { theme: e, ...ss }),
      Object.keys(r).reduce(
        (t, i) => ((t[i] = kt(r[i]) ? r[i](e, ss) : r[i]), t),
        {}
      )
    );
  }
  function Mu(r) {
    let e = [];
    return (
      r.forEach((t) => {
        e = [...e, t];
        let i = t?.plugins ?? [];
        i.length !== 0 &&
          i.forEach((n) => {
            n.__isOptionsFunction && (n = n()),
              (e = [...e, ...Mu([n?.config ?? {}])]);
          });
      }),
      e
    );
  }
  function Ow(r) {
    return [...r].reduceRight(
      (t, i) => (kt(i) ? i({ corePlugins: t }) : ru(i, t)),
      eu
    );
  }
  function Ew(r) {
    return [...r].reduceRight((t, i) => [...t, ...i], []);
  }
  function as(r) {
    let e = [...Mu(r), { prefix: '', important: !1, separator: ':' }];
    return cu(
      Hn(
        {
          theme: Aw(_w(Sw(e.map((t) => t?.theme ?? {})))),
          corePlugins: Ow(e.map((t) => t.corePlugins)),
          plugins: Ew(r.map((t) => t?.plugins ?? [])),
        },
        ...e
      )
    );
  }
  var ss,
    Fu = C(() => {
      l();
      si();
      tu();
      iu();
      Gn();
      ou();
      oi();
      pu();
      vt();
      ui();
      ur();
      nr();
      ns();
      ss = {
        colors: Wn,
        negative(r) {
          return Object.keys(r)
            .filter((e) => r[e] !== '0')
            .reduce((e, t) => {
              let i = Je(r[t]);
              return i !== void 0 && (e[`-${t}`] = i), e;
            }, {});
        },
        breakpoints(r) {
          return Object.keys(r)
            .filter((e) => typeof r[e] == 'string')
            .reduce((e, t) => ({ ...e, [`screen-${t}`]: r[t] }), {});
        },
      };
    });
  var hi = v((m5, Nu) => {
    l();
    Nu.exports = {
      content: [],
      presets: [],
      darkMode: 'media',
      theme: {
        accentColor: ({ theme: r }) => ({ ...r('colors'), auto: 'auto' }),
        animation: {
          none: 'none',
          spin: 'spin 1s linear infinite',
          ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
          pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          bounce: 'bounce 1s infinite',
        },
        aria: {
          checked: 'checked="true"',
          disabled: 'disabled="true"',
          expanded: 'expanded="true"',
          hidden: 'hidden="true"',
          pressed: 'pressed="true"',
          readonly: 'readonly="true"',
          required: 'required="true"',
          selected: 'selected="true"',
        },
        aspectRatio: { auto: 'auto', square: '1 / 1', video: '16 / 9' },
        backdropBlur: ({ theme: r }) => r('blur'),
        backdropBrightness: ({ theme: r }) => r('brightness'),
        backdropContrast: ({ theme: r }) => r('contrast'),
        backdropGrayscale: ({ theme: r }) => r('grayscale'),
        backdropHueRotate: ({ theme: r }) => r('hueRotate'),
        backdropInvert: ({ theme: r }) => r('invert'),
        backdropOpacity: ({ theme: r }) => r('opacity'),
        backdropSaturate: ({ theme: r }) => r('saturate'),
        backdropSepia: ({ theme: r }) => r('sepia'),
        backgroundColor: ({ theme: r }) => r('colors'),
        backgroundImage: {
          none: 'none',
          'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
          'gradient-to-tr':
            'linear-gradient(to top right, var(--tw-gradient-stops))',
          'gradient-to-r':
            'linear-gradient(to right, var(--tw-gradient-stops))',
          'gradient-to-br':
            'linear-gradient(to bottom right, var(--tw-gradient-stops))',
          'gradient-to-b':
            'linear-gradient(to bottom, var(--tw-gradient-stops))',
          'gradient-to-bl':
            'linear-gradient(to bottom left, var(--tw-gradient-stops))',
          'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
          'gradient-to-tl':
            'linear-gradient(to top left, var(--tw-gradient-stops))',
        },
        backgroundOpacity: ({ theme: r }) => r('opacity'),
        backgroundPosition: {
          bottom: 'bottom',
          center: 'center',
          left: 'left',
          'left-bottom': 'left bottom',
          'left-top': 'left top',
          right: 'right',
          'right-bottom': 'right bottom',
          'right-top': 'right top',
          top: 'top',
        },
        backgroundSize: { auto: 'auto', cover: 'cover', contain: 'contain' },
        blur: {
          0: '0',
          none: '0',
          sm: '4px',
          DEFAULT: '8px',
          md: '12px',
          lg: '16px',
          xl: '24px',
          '2xl': '40px',
          '3xl': '64px',
        },
        borderColor: ({ theme: r }) => ({
          ...r('colors'),
          DEFAULT: r('colors.gray.200', 'currentColor'),
        }),
        borderOpacity: ({ theme: r }) => r('opacity'),
        borderRadius: {
          none: '0px',
          sm: '0.125rem',
          DEFAULT: '0.25rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          full: '9999px',
        },
        borderSpacing: ({ theme: r }) => ({ ...r('spacing') }),
        borderWidth: { DEFAULT: '1px', 0: '0px', 2: '2px', 4: '4px', 8: '8px' },
        boxShadow: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          DEFAULT:
            '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
          inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
          none: 'none',
        },
        boxShadowColor: ({ theme: r }) => r('colors'),
        brightness: {
          0: '0',
          50: '.5',
          75: '.75',
          90: '.9',
          95: '.95',
          100: '1',
          105: '1.05',
          110: '1.1',
          125: '1.25',
          150: '1.5',
          200: '2',
        },
        caretColor: ({ theme: r }) => r('colors'),
        colors: ({ colors: r }) => ({
          inherit: r.inherit,
          current: r.current,
          transparent: r.transparent,
          black: r.black,
          white: r.white,
          slate: r.slate,
          gray: r.gray,
          zinc: r.zinc,
          neutral: r.neutral,
          stone: r.stone,
          red: r.red,
          orange: r.orange,
          amber: r.amber,
          yellow: r.yellow,
          lime: r.lime,
          green: r.green,
          emerald: r.emerald,
          teal: r.teal,
          cyan: r.cyan,
          sky: r.sky,
          blue: r.blue,
          indigo: r.indigo,
          violet: r.violet,
          purple: r.purple,
          fuchsia: r.fuchsia,
          pink: r.pink,
          rose: r.rose,
        }),
        columns: {
          auto: 'auto',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
          8: '8',
          9: '9',
          10: '10',
          11: '11',
          12: '12',
          '3xs': '16rem',
          '2xs': '18rem',
          xs: '20rem',
          sm: '24rem',
          md: '28rem',
          lg: '32rem',
          xl: '36rem',
          '2xl': '42rem',
          '3xl': '48rem',
          '4xl': '56rem',
          '5xl': '64rem',
          '6xl': '72rem',
          '7xl': '80rem',
        },
        container: {},
        content: { none: 'none' },
        contrast: {
          0: '0',
          50: '.5',
          75: '.75',
          100: '1',
          125: '1.25',
          150: '1.5',
          200: '2',
        },
        cursor: {
          auto: 'auto',
          default: 'default',
          pointer: 'pointer',
          wait: 'wait',
          text: 'text',
          move: 'move',
          help: 'help',
          'not-allowed': 'not-allowed',
          none: 'none',
          'context-menu': 'context-menu',
          progress: 'progress',
          cell: 'cell',
          crosshair: 'crosshair',
          'vertical-text': 'vertical-text',
          alias: 'alias',
          copy: 'copy',
          'no-drop': 'no-drop',
          grab: 'grab',
          grabbing: 'grabbing',
          'all-scroll': 'all-scroll',
          'col-resize': 'col-resize',
          'row-resize': 'row-resize',
          'n-resize': 'n-resize',
          'e-resize': 'e-resize',
          's-resize': 's-resize',
          'w-resize': 'w-resize',
          'ne-resize': 'ne-resize',
          'nw-resize': 'nw-resize',
          'se-resize': 'se-resize',
          'sw-resize': 'sw-resize',
          'ew-resize': 'ew-resize',
          'ns-resize': 'ns-resize',
          'nesw-resize': 'nesw-resize',
          'nwse-resize': 'nwse-resize',
          'zoom-in': 'zoom-in',
          'zoom-out': 'zoom-out',
        },
        divideColor: ({ theme: r }) => r('borderColor'),
        divideOpacity: ({ theme: r }) => r('borderOpacity'),
        divideWidth: ({ theme: r }) => r('borderWidth'),
        dropShadow: {
          sm: '0 1px 1px rgb(0 0 0 / 0.05)',
          DEFAULT: [
            '0 1px 2px rgb(0 0 0 / 0.1)',
            '0 1px 1px rgb(0 0 0 / 0.06)',
          ],
          md: ['0 4px 3px rgb(0 0 0 / 0.07)', '0 2px 2px rgb(0 0 0 / 0.06)'],
          lg: ['0 10px 8px rgb(0 0 0 / 0.04)', '0 4px 3px rgb(0 0 0 / 0.1)'],
          xl: ['0 20px 13px rgb(0 0 0 / 0.03)', '0 8px 5px rgb(0 0 0 / 0.08)'],
          '2xl': '0 25px 25px rgb(0 0 0 / 0.15)',
          none: '0 0 #0000',
        },
        fill: ({ theme: r }) => ({ none: 'none', ...r('colors') }),
        flex: {
          1: '1 1 0%',
          auto: '1 1 auto',
          initial: '0 1 auto',
          none: 'none',
        },
        flexBasis: ({ theme: r }) => ({
          auto: 'auto',
          ...r('spacing'),
          '1/2': '50%',
          '1/3': '33.333333%',
          '2/3': '66.666667%',
          '1/4': '25%',
          '2/4': '50%',
          '3/4': '75%',
          '1/5': '20%',
          '2/5': '40%',
          '3/5': '60%',
          '4/5': '80%',
          '1/6': '16.666667%',
          '2/6': '33.333333%',
          '3/6': '50%',
          '4/6': '66.666667%',
          '5/6': '83.333333%',
          '1/12': '8.333333%',
          '2/12': '16.666667%',
          '3/12': '25%',
          '4/12': '33.333333%',
          '5/12': '41.666667%',
          '6/12': '50%',
          '7/12': '58.333333%',
          '8/12': '66.666667%',
          '9/12': '75%',
          '10/12': '83.333333%',
          '11/12': '91.666667%',
          full: '100%',
        }),
        flexGrow: { 0: '0', DEFAULT: '1' },
        flexShrink: { 0: '0', DEFAULT: '1' },
        fontFamily: {
          sans: [
            'ui-sans-serif',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            '"Noto Sans"',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"',
          ],
          serif: [
            'ui-serif',
            'Georgia',
            'Cambria',
            '"Times New Roman"',
            'Times',
            'serif',
          ],
          mono: [
            'ui-monospace',
            'SFMono-Regular',
            'Menlo',
            'Monaco',
            'Consolas',
            '"Liberation Mono"',
            '"Courier New"',
            'monospace',
          ],
        },
        fontSize: {
          xs: ['0.75rem', { lineHeight: '1rem' }],
          sm: ['0.875rem', { lineHeight: '1.25rem' }],
          base: ['1rem', { lineHeight: '1.5rem' }],
          lg: ['1.125rem', { lineHeight: '1.75rem' }],
          xl: ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
          '7xl': ['4.5rem', { lineHeight: '1' }],
          '8xl': ['6rem', { lineHeight: '1' }],
          '9xl': ['8rem', { lineHeight: '1' }],
        },
        fontWeight: {
          thin: '100',
          extralight: '200',
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
          extrabold: '800',
          black: '900',
        },
        gap: ({ theme: r }) => r('spacing'),
        gradientColorStops: ({ theme: r }) => r('colors'),
        gradientColorStopPositions: {
          '0%': '0%',
          '5%': '5%',
          '10%': '10%',
          '15%': '15%',
          '20%': '20%',
          '25%': '25%',
          '30%': '30%',
          '35%': '35%',
          '40%': '40%',
          '45%': '45%',
          '50%': '50%',
          '55%': '55%',
          '60%': '60%',
          '65%': '65%',
          '70%': '70%',
          '75%': '75%',
          '80%': '80%',
          '85%': '85%',
          '90%': '90%',
          '95%': '95%',
          '100%': '100%',
        },
        grayscale: { 0: '0', DEFAULT: '100%' },
        gridAutoColumns: {
          auto: 'auto',
          min: 'min-content',
          max: 'max-content',
          fr: 'minmax(0, 1fr)',
        },
        gridAutoRows: {
          auto: 'auto',
          min: 'min-content',
          max: 'max-content',
          fr: 'minmax(0, 1fr)',
        },
        gridColumn: {
          auto: 'auto',
          'span-1': 'span 1 / span 1',
          'span-2': 'span 2 / span 2',
          'span-3': 'span 3 / span 3',
          'span-4': 'span 4 / span 4',
          'span-5': 'span 5 / span 5',
          'span-6': 'span 6 / span 6',
          'span-7': 'span 7 / span 7',
          'span-8': 'span 8 / span 8',
          'span-9': 'span 9 / span 9',
          'span-10': 'span 10 / span 10',
          'span-11': 'span 11 / span 11',
          'span-12': 'span 12 / span 12',
          'span-full': '1 / -1',
        },
        gridColumnEnd: {
          auto: 'auto',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
          8: '8',
          9: '9',
          10: '10',
          11: '11',
          12: '12',
          13: '13',
        },
        gridColumnStart: {
          auto: 'auto',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
          8: '8',
          9: '9',
          10: '10',
          11: '11',
          12: '12',
          13: '13',
        },
        gridRow: {
          auto: 'auto',
          'span-1': 'span 1 / span 1',
          'span-2': 'span 2 / span 2',
          'span-3': 'span 3 / span 3',
          'span-4': 'span 4 / span 4',
          'span-5': 'span 5 / span 5',
          'span-6': 'span 6 / span 6',
          'span-full': '1 / -1',
        },
        gridRowEnd: {
          auto: 'auto',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
        },
        gridRowStart: {
          auto: 'auto',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
        },
        gridTemplateColumns: {
          none: 'none',
          1: 'repeat(1, minmax(0, 1fr))',
          2: 'repeat(2, minmax(0, 1fr))',
          3: 'repeat(3, minmax(0, 1fr))',
          4: 'repeat(4, minmax(0, 1fr))',
          5: 'repeat(5, minmax(0, 1fr))',
          6: 'repeat(6, minmax(0, 1fr))',
          7: 'repeat(7, minmax(0, 1fr))',
          8: 'repeat(8, minmax(0, 1fr))',
          9: 'repeat(9, minmax(0, 1fr))',
          10: 'repeat(10, minmax(0, 1fr))',
          11: 'repeat(11, minmax(0, 1fr))',
          12: 'repeat(12, minmax(0, 1fr))',
        },
        gridTemplateRows: {
          none: 'none',
          1: 'repeat(1, minmax(0, 1fr))',
          2: 'repeat(2, minmax(0, 1fr))',
          3: 'repeat(3, minmax(0, 1fr))',
          4: 'repeat(4, minmax(0, 1fr))',
          5: 'repeat(5, minmax(0, 1fr))',
          6: 'repeat(6, minmax(0, 1fr))',
        },
        height: ({ theme: r }) => ({
          auto: 'auto',
          ...r('spacing'),
          '1/2': '50%',
          '1/3': '33.333333%',
          '2/3': '66.666667%',
          '1/4': '25%',
          '2/4': '50%',
          '3/4': '75%',
          '1/5': '20%',
          '2/5': '40%',
          '3/5': '60%',
          '4/5': '80%',
          '1/6': '16.666667%',
          '2/6': '33.333333%',
          '3/6': '50%',
          '4/6': '66.666667%',
          '5/6': '83.333333%',
          full: '100%',
          screen: '100vh',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
        }),
        hueRotate: {
          0: '0deg',
          15: '15deg',
          30: '30deg',
          60: '60deg',
          90: '90deg',
          180: '180deg',
        },
        inset: ({ theme: r }) => ({
          auto: 'auto',
          ...r('spacing'),
          '1/2': '50%',
          '1/3': '33.333333%',
          '2/3': '66.666667%',
          '1/4': '25%',
          '2/4': '50%',
          '3/4': '75%',
          full: '100%',
        }),
        invert: { 0: '0', DEFAULT: '100%' },
        keyframes: {
          spin: { to: { transform: 'rotate(360deg)' } },
          ping: { '75%, 100%': { transform: 'scale(2)', opacity: '0' } },
          pulse: { '50%': { opacity: '.5' } },
          bounce: {
            '0%, 100%': {
              transform: 'translateY(-25%)',
              animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
            },
            '50%': {
              transform: 'none',
              animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
            },
          },
        },
        letterSpacing: {
          tighter: '-0.05em',
          tight: '-0.025em',
          normal: '0em',
          wide: '0.025em',
          wider: '0.05em',
          widest: '0.1em',
        },
        lineHeight: {
          none: '1',
          tight: '1.25',
          snug: '1.375',
          normal: '1.5',
          relaxed: '1.625',
          loose: '2',
          3: '.75rem',
          4: '1rem',
          5: '1.25rem',
          6: '1.5rem',
          7: '1.75rem',
          8: '2rem',
          9: '2.25rem',
          10: '2.5rem',
        },
        listStyleType: { none: 'none', disc: 'disc', decimal: 'decimal' },
        listStyleImage: { none: 'none' },
        margin: ({ theme: r }) => ({ auto: 'auto', ...r('spacing') }),
        lineClamp: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' },
        maxHeight: ({ theme: r }) => ({
          ...r('spacing'),
          none: 'none',
          full: '100%',
          screen: '100vh',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
        }),
        maxWidth: ({ theme: r, breakpoints: e }) => ({
          none: 'none',
          0: '0rem',
          xs: '20rem',
          sm: '24rem',
          md: '28rem',
          lg: '32rem',
          xl: '36rem',
          '2xl': '42rem',
          '3xl': '48rem',
          '4xl': '56rem',
          '5xl': '64rem',
          '6xl': '72rem',
          '7xl': '80rem',
          full: '100%',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
          prose: '65ch',
          ...e(r('screens')),
        }),
        minHeight: {
          0: '0px',
          full: '100%',
          screen: '100vh',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
        },
        minWidth: {
          0: '0px',
          full: '100%',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
        },
        objectPosition: {
          bottom: 'bottom',
          center: 'center',
          left: 'left',
          'left-bottom': 'left bottom',
          'left-top': 'left top',
          right: 'right',
          'right-bottom': 'right bottom',
          'right-top': 'right top',
          top: 'top',
        },
        opacity: {
          0: '0',
          5: '0.05',
          10: '0.1',
          20: '0.2',
          25: '0.25',
          30: '0.3',
          40: '0.4',
          50: '0.5',
          60: '0.6',
          70: '0.7',
          75: '0.75',
          80: '0.8',
          90: '0.9',
          95: '0.95',
          100: '1',
        },
        order: {
          first: '-9999',
          last: '9999',
          none: '0',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
          8: '8',
          9: '9',
          10: '10',
          11: '11',
          12: '12',
        },
        outlineColor: ({ theme: r }) => r('colors'),
        outlineOffset: { 0: '0px', 1: '1px', 2: '2px', 4: '4px', 8: '8px' },
        outlineWidth: { 0: '0px', 1: '1px', 2: '2px', 4: '4px', 8: '8px' },
        padding: ({ theme: r }) => r('spacing'),
        placeholderColor: ({ theme: r }) => r('colors'),
        placeholderOpacity: ({ theme: r }) => r('opacity'),
        ringColor: ({ theme: r }) => ({
          DEFAULT: r('colors.blue.500', '#3b82f6'),
          ...r('colors'),
        }),
        ringOffsetColor: ({ theme: r }) => r('colors'),
        ringOffsetWidth: { 0: '0px', 1: '1px', 2: '2px', 4: '4px', 8: '8px' },
        ringOpacity: ({ theme: r }) => ({ DEFAULT: '0.5', ...r('opacity') }),
        ringWidth: {
          DEFAULT: '3px',
          0: '0px',
          1: '1px',
          2: '2px',
          4: '4px',
          8: '8px',
        },
        rotate: {
          0: '0deg',
          1: '1deg',
          2: '2deg',
          3: '3deg',
          6: '6deg',
          12: '12deg',
          45: '45deg',
          90: '90deg',
          180: '180deg',
        },
        saturate: { 0: '0', 50: '.5', 100: '1', 150: '1.5', 200: '2' },
        scale: {
          0: '0',
          50: '.5',
          75: '.75',
          90: '.9',
          95: '.95',
          100: '1',
          105: '1.05',
          110: '1.1',
          125: '1.25',
          150: '1.5',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
        scrollMargin: ({ theme: r }) => ({ ...r('spacing') }),
        scrollPadding: ({ theme: r }) => r('spacing'),
        sepia: { 0: '0', DEFAULT: '100%' },
        skew: {
          0: '0deg',
          1: '1deg',
          2: '2deg',
          3: '3deg',
          6: '6deg',
          12: '12deg',
        },
        space: ({ theme: r }) => ({ ...r('spacing') }),
        spacing: {
          px: '1px',
          0: '0px',
          0.5: '0.125rem',
          1: '0.25rem',
          1.5: '0.375rem',
          2: '0.5rem',
          2.5: '0.625rem',
          3: '0.75rem',
          3.5: '0.875rem',
          4: '1rem',
          5: '1.25rem',
          6: '1.5rem',
          7: '1.75rem',
          8: '2rem',
          9: '2.25rem',
          10: '2.5rem',
          11: '2.75rem',
          12: '3rem',
          14: '3.5rem',
          16: '4rem',
          20: '5rem',
          24: '6rem',
          28: '7rem',
          32: '8rem',
          36: '9rem',
          40: '10rem',
          44: '11rem',
          48: '12rem',
          52: '13rem',
          56: '14rem',
          60: '15rem',
          64: '16rem',
          72: '18rem',
          80: '20rem',
          96: '24rem',
        },
        stroke: ({ theme: r }) => ({ none: 'none', ...r('colors') }),
        strokeWidth: { 0: '0', 1: '1', 2: '2' },
        supports: {},
        data: {},
        textColor: ({ theme: r }) => r('colors'),
        textDecorationColor: ({ theme: r }) => r('colors'),
        textDecorationThickness: {
          auto: 'auto',
          'from-font': 'from-font',
          0: '0px',
          1: '1px',
          2: '2px',
          4: '4px',
          8: '8px',
        },
        textIndent: ({ theme: r }) => ({ ...r('spacing') }),
        textOpacity: ({ theme: r }) => r('opacity'),
        textUnderlineOffset: {
          auto: 'auto',
          0: '0px',
          1: '1px',
          2: '2px',
          4: '4px',
          8: '8px',
        },
        transformOrigin: {
          center: 'center',
          top: 'top',
          'top-right': 'top right',
          right: 'right',
          'bottom-right': 'bottom right',
          bottom: 'bottom',
          'bottom-left': 'bottom left',
          left: 'left',
          'top-left': 'top left',
        },
        transitionDelay: {
          0: '0s',
          75: '75ms',
          100: '100ms',
          150: '150ms',
          200: '200ms',
          300: '300ms',
          500: '500ms',
          700: '700ms',
          1e3: '1000ms',
        },
        transitionDuration: {
          DEFAULT: '150ms',
          0: '0s',
          75: '75ms',
          100: '100ms',
          150: '150ms',
          200: '200ms',
          300: '300ms',
          500: '500ms',
          700: '700ms',
          1e3: '1000ms',
        },
        transitionProperty: {
          none: 'none',
          all: 'all',
          DEFAULT:
            'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
          colors:
            'color, background-color, border-color, text-decoration-color, fill, stroke',
          opacity: 'opacity',
          shadow: 'box-shadow',
          transform: 'transform',
        },
        transitionTimingFunction: {
          DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
          linear: 'linear',
          in: 'cubic-bezier(0.4, 0, 1, 1)',
          out: 'cubic-bezier(0, 0, 0.2, 1)',
          'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        translate: ({ theme: r }) => ({
          ...r('spacing'),
          '1/2': '50%',
          '1/3': '33.333333%',
          '2/3': '66.666667%',
          '1/4': '25%',
          '2/4': '50%',
          '3/4': '75%',
          full: '100%',
        }),
        width: ({ theme: r }) => ({
          auto: 'auto',
          ...r('spacing'),
          '1/2': '50%',
          '1/3': '33.333333%',
          '2/3': '66.666667%',
          '1/4': '25%',
          '2/4': '50%',
          '3/4': '75%',
          '1/5': '20%',
          '2/5': '40%',
          '3/5': '60%',
          '4/5': '80%',
          '1/6': '16.666667%',
          '2/6': '33.333333%',
          '3/6': '50%',
          '4/6': '66.666667%',
          '5/6': '83.333333%',
          '1/12': '8.333333%',
          '2/12': '16.666667%',
          '3/12': '25%',
          '4/12': '33.333333%',
          '5/12': '41.666667%',
          '6/12': '50%',
          '7/12': '58.333333%',
          '8/12': '66.666667%',
          '9/12': '75%',
          '10/12': '83.333333%',
          '11/12': '91.666667%',
          full: '100%',
          screen: '100vw',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
        }),
        willChange: {
          auto: 'auto',
          scroll: 'scroll-position',
          contents: 'contents',
          transform: 'transform',
        },
        zIndex: {
          auto: 'auto',
          0: '0',
          10: '10',
          20: '20',
          30: '30',
          40: '40',
          50: '50',
        },
      },
      plugins: [],
    };
  });
  function mi(r) {
    let e = (r?.presets ?? [Lu.default])
        .slice()
        .reverse()
        .flatMap((n) => mi(n instanceof Function ? n() : n)),
      t = {
        respectDefaultRingColorOpacity: {
          theme: {
            ringColor: ({ theme: n }) => ({
              DEFAULT: '#3b82f67f',
              ...n('colors'),
            }),
          },
        },
        disableColorOpacityUtilitiesByDefault: {
          corePlugins: {
            backgroundOpacity: !1,
            borderOpacity: !1,
            divideOpacity: !1,
            placeholderOpacity: !1,
            ringOpacity: !1,
            textOpacity: !1,
          },
        },
      },
      i = Object.keys(t)
        .filter((n) => J(r, n))
        .map((n) => t[n]);
    return [r, ...i, ...e];
  }
  var Lu,
    Bu = C(() => {
      l();
      Lu = K(hi());
      De();
    });
  var $u = {};
  Ce($u, { default: () => cr });
  function cr(...r) {
    let [, ...e] = mi(r[0]);
    return as([...r, ...e]);
  }
  var os = C(() => {
    l();
    Fu();
    Bu();
  });
  var ju = {};
  Ce(ju, { default: () => te });
  var te,
    dt = C(() => {
      l();
      te = { resolve: (r) => r, extname: (r) => '.' + r.split('.').pop() };
    });
  function gi(r) {
    return typeof r == 'object' && r !== null;
  }
  function Pw(r) {
    return Object.keys(r).length === 0;
  }
  function zu(r) {
    return typeof r == 'string' || r instanceof String;
  }
  function ls(r) {
    return gi(r) && r.config === void 0 && !Pw(r)
      ? null
      : gi(r) && r.config !== void 0 && zu(r.config)
      ? te.resolve(r.config)
      : gi(r) && r.config !== void 0 && gi(r.config)
      ? null
      : zu(r)
      ? te.resolve(r)
      : Dw();
  }
  function Dw() {
    for (let r of Tw)
      try {
        let e = te.resolve(r);
        return ie.accessSync(e), e;
      } catch (e) {}
    return null;
  }
  var Tw,
    Vu = C(() => {
      l();
      je();
      dt();
      Tw = [
        './tailwind.config.js',
        './tailwind.config.cjs',
        './tailwind.config.mjs',
        './tailwind.config.ts',
      ];
    });
  var Uu = {};
  Ce(Uu, { default: () => us });
  var us,
    fs = C(() => {
      l();
      us = { parse: (r) => ({ href: r }) };
    });
  var cs = v(() => {
    l();
  });
  var yi = v((C5, Hu) => {
    l();
    ('use strict');
    var Wu = (ai(), nu),
      Gu = cs(),
      St = class extends Error {
        constructor(e, t, i, n, s, a) {
          super(e);
          (this.name = 'CssSyntaxError'),
            (this.reason = e),
            s && (this.file = s),
            n && (this.source = n),
            a && (this.plugin = a),
            typeof t != 'undefined' &&
              typeof i != 'undefined' &&
              (typeof t == 'number'
                ? ((this.line = t), (this.column = i))
                : ((this.line = t.line),
                  (this.column = t.column),
                  (this.endLine = i.line),
                  (this.endColumn = i.column))),
            this.setMessage(),
            Error.captureStackTrace && Error.captureStackTrace(this, St);
        }
        setMessage() {
          (this.message = this.plugin ? this.plugin + ': ' : ''),
            (this.message += this.file ? this.file : '<css input>'),
            typeof this.line != 'undefined' &&
              (this.message += ':' + this.line + ':' + this.column),
            (this.message += ': ' + this.reason);
        }
        showSourceCode(e) {
          if (!this.source) return '';
          let t = this.source;
          e == null && (e = Wu.isColorSupported), Gu && e && (t = Gu(t));
          let i = t.split(/\r?\n/),
            n = Math.max(this.line - 3, 0),
            s = Math.min(this.line + 2, i.length),
            a = String(s).length,
            o,
            u;
          if (e) {
            let { bold: c, red: f, gray: p } = Wu.createColors(!0);
            (o = (d) => c(f(d))), (u = (d) => p(d));
          } else o = u = (c) => c;
          return i.slice(n, s).map((c, f) => {
            let p = n + 1 + f,
              d = ' ' + (' ' + p).slice(-a) + ' | ';
            if (p === this.line) {
              let h =
                u(d.replace(/\d/g, ' ')) +
                c.slice(0, this.column - 1).replace(/[^\t]/g, ' ');
              return (
                o('>') +
                u(d) +
                c +
                `
 ` +
                h +
                o('^')
              );
            }
            return ' ' + u(d) + c;
          }).join(`
`);
        }
        toString() {
          let e = this.showSourceCode();
          return (
            e &&
              (e =
                `

` +
                e +
                `
`),
            this.name + ': ' + this.message + e
          );
        }
      };
    Hu.exports = St;
    St.default = St;
  });
  var bi = v((A5, ps) => {
    l();
    ('use strict');
    ps.exports.isClean = Symbol('isClean');
    ps.exports.my = Symbol('my');
  });
  var ds = v((O5, Qu) => {
    l();
    ('use strict');
    var Yu = {
      colon: ': ',
      indent: '    ',
      beforeDecl: `
`,
      beforeRule: `
`,
      beforeOpen: ' ',
      beforeClose: `
`,
      beforeComment: `
`,
      after: `
`,
      emptyBody: '',
      commentLeft: ' ',
      commentRight: ' ',
      semicolon: !1,
    };
    function Iw(r) {
      return r[0].toUpperCase() + r.slice(1);
    }
    var wi = class {
      constructor(e) {
        this.builder = e;
      }
      stringify(e, t) {
        if (!this[e.type])
          throw new Error(
            'Unknown AST node type ' +
              e.type +
              '. Maybe you need to change PostCSS stringifier.'
          );
        this[e.type](e, t);
      }
      document(e) {
        this.body(e);
      }
      root(e) {
        this.body(e), e.raws.after && this.builder(e.raws.after);
      }
      comment(e) {
        let t = this.raw(e, 'left', 'commentLeft'),
          i = this.raw(e, 'right', 'commentRight');
        this.builder('/*' + t + e.text + i + '*/', e);
      }
      decl(e, t) {
        let i = this.raw(e, 'between', 'colon'),
          n = e.prop + i + this.rawValue(e, 'value');
        e.important && (n += e.raws.important || ' !important'),
          t && (n += ';'),
          this.builder(n, e);
      }
      rule(e) {
        this.block(e, this.rawValue(e, 'selector')),
          e.raws.ownSemicolon && this.builder(e.raws.ownSemicolon, e, 'end');
      }
      atrule(e, t) {
        let i = '@' + e.name,
          n = e.params ? this.rawValue(e, 'params') : '';
        if (
          (typeof e.raws.afterName != 'undefined'
            ? (i += e.raws.afterName)
            : n && (i += ' '),
          e.nodes)
        )
          this.block(e, i + n);
        else {
          let s = (e.raws.between || '') + (t ? ';' : '');
          this.builder(i + n + s, e);
        }
      }
      body(e) {
        let t = e.nodes.length - 1;
        for (; t > 0 && e.nodes[t].type === 'comment'; ) t -= 1;
        let i = this.raw(e, 'semicolon');
        for (let n = 0; n < e.nodes.length; n++) {
          let s = e.nodes[n],
            a = this.raw(s, 'before');
          a && this.builder(a), this.stringify(s, t !== n || i);
        }
      }
      block(e, t) {
        let i = this.raw(e, 'between', 'beforeOpen');
        this.builder(t + i + '{', e, 'start');
        let n;
        e.nodes && e.nodes.length
          ? (this.body(e), (n = this.raw(e, 'after')))
          : (n = this.raw(e, 'after', 'emptyBody')),
          n && this.builder(n),
          this.builder('}', e, 'end');
      }
      raw(e, t, i) {
        let n;
        if ((i || (i = t), t && ((n = e.raws[t]), typeof n != 'undefined')))
          return n;
        let s = e.parent;
        if (
          i === 'before' &&
          (!s ||
            (s.type === 'root' && s.first === e) ||
            (s && s.type === 'document'))
        )
          return '';
        if (!s) return Yu[i];
        let a = e.root();
        if (
          (a.rawCache || (a.rawCache = {}), typeof a.rawCache[i] != 'undefined')
        )
          return a.rawCache[i];
        if (i === 'before' || i === 'after') return this.beforeAfter(e, i);
        {
          let o = 'raw' + Iw(i);
          this[o]
            ? (n = this[o](a, e))
            : a.walk((u) => {
                if (((n = u.raws[t]), typeof n != 'undefined')) return !1;
              });
        }
        return typeof n == 'undefined' && (n = Yu[i]), (a.rawCache[i] = n), n;
      }
      rawSemicolon(e) {
        let t;
        return (
          e.walk((i) => {
            if (
              i.nodes &&
              i.nodes.length &&
              i.last.type === 'decl' &&
              ((t = i.raws.semicolon), typeof t != 'undefined')
            )
              return !1;
          }),
          t
        );
      }
      rawEmptyBody(e) {
        let t;
        return (
          e.walk((i) => {
            if (
              i.nodes &&
              i.nodes.length === 0 &&
              ((t = i.raws.after), typeof t != 'undefined')
            )
              return !1;
          }),
          t
        );
      }
      rawIndent(e) {
        if (e.raws.indent) return e.raws.indent;
        let t;
        return (
          e.walk((i) => {
            let n = i.parent;
            if (
              n &&
              n !== e &&
              n.parent &&
              n.parent === e &&
              typeof i.raws.before != 'undefined'
            ) {
              let s = i.raws.before.split(`
`);
              return (t = s[s.length - 1]), (t = t.replace(/\S/g, '')), !1;
            }
          }),
          t
        );
      }
      rawBeforeComment(e, t) {
        let i;
        return (
          e.walkComments((n) => {
            if (typeof n.raws.before != 'undefined')
              return (
                (i = n.raws.before),
                i.includes(`
`) && (i = i.replace(/[^\n]+$/, '')),
                !1
              );
          }),
          typeof i == 'undefined'
            ? (i = this.raw(t, null, 'beforeDecl'))
            : i && (i = i.replace(/\S/g, '')),
          i
        );
      }
      rawBeforeDecl(e, t) {
        let i;
        return (
          e.walkDecls((n) => {
            if (typeof n.raws.before != 'undefined')
              return (
                (i = n.raws.before),
                i.includes(`
`) && (i = i.replace(/[^\n]+$/, '')),
                !1
              );
          }),
          typeof i == 'undefined'
            ? (i = this.raw(t, null, 'beforeRule'))
            : i && (i = i.replace(/\S/g, '')),
          i
        );
      }
      rawBeforeRule(e) {
        let t;
        return (
          e.walk((i) => {
            if (
              i.nodes &&
              (i.parent !== e || e.first !== i) &&
              typeof i.raws.before != 'undefined'
            )
              return (
                (t = i.raws.before),
                t.includes(`
`) && (t = t.replace(/[^\n]+$/, '')),
                !1
              );
          }),
          t && (t = t.replace(/\S/g, '')),
          t
        );
      }
      rawBeforeClose(e) {
        let t;
        return (
          e.walk((i) => {
            if (
              i.nodes &&
              i.nodes.length > 0 &&
              typeof i.raws.after != 'undefined'
            )
              return (
                (t = i.raws.after),
                t.includes(`
`) && (t = t.replace(/[^\n]+$/, '')),
                !1
              );
          }),
          t && (t = t.replace(/\S/g, '')),
          t
        );
      }
      rawBeforeOpen(e) {
        let t;
        return (
          e.walk((i) => {
            if (
              i.type !== 'decl' &&
              ((t = i.raws.between), typeof t != 'undefined')
            )
              return !1;
          }),
          t
        );
      }
      rawColon(e) {
        let t;
        return (
          e.walkDecls((i) => {
            if (typeof i.raws.between != 'undefined')
              return (t = i.raws.between.replace(/[^\s:]/g, '')), !1;
          }),
          t
        );
      }
      beforeAfter(e, t) {
        let i;
        e.type === 'decl'
          ? (i = this.raw(e, null, 'beforeDecl'))
          : e.type === 'comment'
          ? (i = this.raw(e, null, 'beforeComment'))
          : t === 'before'
          ? (i = this.raw(e, null, 'beforeRule'))
          : (i = this.raw(e, null, 'beforeClose'));
        let n = e.parent,
          s = 0;
        for (; n && n.type !== 'root'; ) (s += 1), (n = n.parent);
        if (
          i.includes(`
`)
        ) {
          let a = this.raw(e, null, 'indent');
          if (a.length) for (let o = 0; o < s; o++) i += a;
        }
        return i;
      }
      rawValue(e, t) {
        let i = e[t],
          n = e.raws[t];
        return n && n.value === i ? n.raw : i;
      }
    };
    Qu.exports = wi;
    wi.default = wi;
  });
  var pr = v((E5, Ju) => {
    l();
    ('use strict');
    var qw = ds();
    function hs(r, e) {
      new qw(e).stringify(r);
    }
    Ju.exports = hs;
    hs.default = hs;
  });
  var dr = v((T5, Xu) => {
    l();
    ('use strict');
    var { isClean: vi, my: Rw } = bi(),
      Mw = yi(),
      Fw = ds(),
      Nw = pr();
    function ms(r, e) {
      let t = new r.constructor();
      for (let i in r) {
        if (!Object.prototype.hasOwnProperty.call(r, i) || i === 'proxyCache')
          continue;
        let n = r[i],
          s = typeof n;
        i === 'parent' && s === 'object'
          ? e && (t[i] = e)
          : i === 'source'
          ? (t[i] = n)
          : Array.isArray(n)
          ? (t[i] = n.map((a) => ms(a, t)))
          : (s === 'object' && n !== null && (n = ms(n)), (t[i] = n));
      }
      return t;
    }
    var xi = class {
      constructor(e = {}) {
        (this.raws = {}), (this[vi] = !1), (this[Rw] = !0);
        for (let t in e)
          if (t === 'nodes') {
            this.nodes = [];
            for (let i of e[t])
              typeof i.clone == 'function'
                ? this.append(i.clone())
                : this.append(i);
          } else this[t] = e[t];
      }
      error(e, t = {}) {
        if (this.source) {
          let { start: i, end: n } = this.rangeBy(t);
          return this.source.input.error(
            e,
            { line: i.line, column: i.column },
            { line: n.line, column: n.column },
            t
          );
        }
        return new Mw(e);
      }
      warn(e, t, i) {
        let n = { node: this };
        for (let s in i) n[s] = i[s];
        return e.warn(t, n);
      }
      remove() {
        return (
          this.parent && this.parent.removeChild(this),
          (this.parent = void 0),
          this
        );
      }
      toString(e = Nw) {
        e.stringify && (e = e.stringify);
        let t = '';
        return (
          e(this, (i) => {
            t += i;
          }),
          t
        );
      }
      assign(e = {}) {
        for (let t in e) this[t] = e[t];
        return this;
      }
      clone(e = {}) {
        let t = ms(this);
        for (let i in e) t[i] = e[i];
        return t;
      }
      cloneBefore(e = {}) {
        let t = this.clone(e);
        return this.parent.insertBefore(this, t), t;
      }
      cloneAfter(e = {}) {
        let t = this.clone(e);
        return this.parent.insertAfter(this, t), t;
      }
      replaceWith(...e) {
        if (this.parent) {
          let t = this,
            i = !1;
          for (let n of e)
            n === this
              ? (i = !0)
              : i
              ? (this.parent.insertAfter(t, n), (t = n))
              : this.parent.insertBefore(t, n);
          i || this.remove();
        }
        return this;
      }
      next() {
        if (!this.parent) return;
        let e = this.parent.index(this);
        return this.parent.nodes[e + 1];
      }
      prev() {
        if (!this.parent) return;
        let e = this.parent.index(this);
        return this.parent.nodes[e - 1];
      }
      before(e) {
        return this.parent.insertBefore(this, e), this;
      }
      after(e) {
        return this.parent.insertAfter(this, e), this;
      }
      root() {
        let e = this;
        for (; e.parent && e.parent.type !== 'document'; ) e = e.parent;
        return e;
      }
      raw(e, t) {
        return new Fw().raw(this, e, t);
      }
      cleanRaws(e) {
        delete this.raws.before,
          delete this.raws.after,
          e || delete this.raws.between;
      }
      toJSON(e, t) {
        let i = {},
          n = t == null;
        t = t || new Map();
        let s = 0;
        for (let a in this) {
          if (
            !Object.prototype.hasOwnProperty.call(this, a) ||
            a === 'parent' ||
            a === 'proxyCache'
          )
            continue;
          let o = this[a];
          if (Array.isArray(o))
            i[a] = o.map((u) =>
              typeof u == 'object' && u.toJSON ? u.toJSON(null, t) : u
            );
          else if (typeof o == 'object' && o.toJSON) i[a] = o.toJSON(null, t);
          else if (a === 'source') {
            let u = t.get(o.input);
            u == null && ((u = s), t.set(o.input, s), s++),
              (i[a] = { inputId: u, start: o.start, end: o.end });
          } else i[a] = o;
        }
        return n && (i.inputs = [...t.keys()].map((a) => a.toJSON())), i;
      }
      positionInside(e) {
        let t = this.toString(),
          i = this.source.start.column,
          n = this.source.start.line;
        for (let s = 0; s < e; s++)
          t[s] ===
          `
`
            ? ((i = 1), (n += 1))
            : (i += 1);
        return { line: n, column: i };
      }
      positionBy(e) {
        let t = this.source.start;
        if (e.index) t = this.positionInside(e.index);
        else if (e.word) {
          let i = this.toString().indexOf(e.word);
          i !== -1 && (t = this.positionInside(i));
        }
        return t;
      }
      rangeBy(e) {
        let t = {
            line: this.source.start.line,
            column: this.source.start.column,
          },
          i = this.source.end
            ? { line: this.source.end.line, column: this.source.end.column + 1 }
            : { line: t.line, column: t.column + 1 };
        if (e.word) {
          let n = this.toString().indexOf(e.word);
          n !== -1 &&
            ((t = this.positionInside(n)),
            (i = this.positionInside(n + e.word.length)));
        } else
          e.start
            ? (t = { line: e.start.line, column: e.start.column })
            : e.index && (t = this.positionInside(e.index)),
            e.end
              ? (i = { line: e.end.line, column: e.end.column })
              : e.endIndex
              ? (i = this.positionInside(e.endIndex))
              : e.index && (i = this.positionInside(e.index + 1));
        return (
          (i.line < t.line || (i.line === t.line && i.column <= t.column)) &&
            (i = { line: t.line, column: t.column + 1 }),
          { start: t, end: i }
        );
      }
      getProxyProcessor() {
        return {
          set(e, t, i) {
            return (
              e[t] === i ||
                ((e[t] = i),
                (t === 'prop' ||
                  t === 'value' ||
                  t === 'name' ||
                  t === 'params' ||
                  t === 'important' ||
                  t === 'text') &&
                  e.markDirty()),
              !0
            );
          },
          get(e, t) {
            return t === 'proxyOf'
              ? e
              : t === 'root'
              ? () => e.root().toProxy()
              : e[t];
          },
        };
      }
      toProxy() {
        return (
          this.proxyCache ||
            (this.proxyCache = new Proxy(this, this.getProxyProcessor())),
          this.proxyCache
        );
      }
      addToError(e) {
        if (
          ((e.postcssNode = this),
          e.stack && this.source && /\n\s{4}at /.test(e.stack))
        ) {
          let t = this.source;
          e.stack = e.stack.replace(
            /\n\s{4}at /,
            `$&${t.input.from}:${t.start.line}:${t.start.column}$&`
          );
        }
        return e;
      }
      markDirty() {
        if (this[vi]) {
          this[vi] = !1;
          let e = this;
          for (; (e = e.parent); ) e[vi] = !1;
        }
      }
      get proxyOf() {
        return this;
      }
    };
    Xu.exports = xi;
    xi.default = xi;
  });
  var hr = v((P5, Ku) => {
    l();
    ('use strict');
    var Lw = dr(),
      ki = class extends Lw {
        constructor(e) {
          e &&
            typeof e.value != 'undefined' &&
            typeof e.value != 'string' &&
            (e = { ...e, value: String(e.value) });
          super(e);
          this.type = 'decl';
        }
        get variable() {
          return this.prop.startsWith('--') || this.prop[0] === '$';
        }
      };
    Ku.exports = ki;
    ki.default = ki;
  });
  var gs = v((D5, Zu) => {
    l();
    Zu.exports = function (r, e) {
      return {
        generate: () => {
          let t = '';
          return (
            r(e, (i) => {
              t += i;
            }),
            [t]
          );
        },
      };
    };
  });
  var mr = v((I5, ef) => {
    l();
    ('use strict');
    var Bw = dr(),
      Si = class extends Bw {
        constructor(e) {
          super(e);
          this.type = 'comment';
        }
      };
    ef.exports = Si;
    Si.default = Si;
  });
  var rt = v((q5, ff) => {
    l();
    ('use strict');
    var { isClean: tf, my: rf } = bi(),
      nf = hr(),
      sf = mr(),
      $w = dr(),
      af,
      ys,
      bs,
      of;
    function lf(r) {
      return r.map(
        (e) => (e.nodes && (e.nodes = lf(e.nodes)), delete e.source, e)
      );
    }
    function uf(r) {
      if (((r[tf] = !1), r.proxyOf.nodes)) for (let e of r.proxyOf.nodes) uf(e);
    }
    var ye = class extends $w {
      push(e) {
        return (e.parent = this), this.proxyOf.nodes.push(e), this;
      }
      each(e) {
        if (!this.proxyOf.nodes) return;
        let t = this.getIterator(),
          i,
          n;
        for (
          ;
          this.indexes[t] < this.proxyOf.nodes.length &&
          ((i = this.indexes[t]), (n = e(this.proxyOf.nodes[i], i)), n !== !1);

        )
          this.indexes[t] += 1;
        return delete this.indexes[t], n;
      }
      walk(e) {
        return this.each((t, i) => {
          let n;
          try {
            n = e(t, i);
          } catch (s) {
            throw t.addToError(s);
          }
          return n !== !1 && t.walk && (n = t.walk(e)), n;
        });
      }
      walkDecls(e, t) {
        return t
          ? e instanceof RegExp
            ? this.walk((i, n) => {
                if (i.type === 'decl' && e.test(i.prop)) return t(i, n);
              })
            : this.walk((i, n) => {
                if (i.type === 'decl' && i.prop === e) return t(i, n);
              })
          : ((t = e),
            this.walk((i, n) => {
              if (i.type === 'decl') return t(i, n);
            }));
      }
      walkRules(e, t) {
        return t
          ? e instanceof RegExp
            ? this.walk((i, n) => {
                if (i.type === 'rule' && e.test(i.selector)) return t(i, n);
              })
            : this.walk((i, n) => {
                if (i.type === 'rule' && i.selector === e) return t(i, n);
              })
          : ((t = e),
            this.walk((i, n) => {
              if (i.type === 'rule') return t(i, n);
            }));
      }
      walkAtRules(e, t) {
        return t
          ? e instanceof RegExp
            ? this.walk((i, n) => {
                if (i.type === 'atrule' && e.test(i.name)) return t(i, n);
              })
            : this.walk((i, n) => {
                if (i.type === 'atrule' && i.name === e) return t(i, n);
              })
          : ((t = e),
            this.walk((i, n) => {
              if (i.type === 'atrule') return t(i, n);
            }));
      }
      walkComments(e) {
        return this.walk((t, i) => {
          if (t.type === 'comment') return e(t, i);
        });
      }
      append(...e) {
        for (let t of e) {
          let i = this.normalize(t, this.last);
          for (let n of i) this.proxyOf.nodes.push(n);
        }
        return this.markDirty(), this;
      }
      prepend(...e) {
        e = e.reverse();
        for (let t of e) {
          let i = this.normalize(t, this.first, 'prepend').reverse();
          for (let n of i) this.proxyOf.nodes.unshift(n);
          for (let n in this.indexes)
            this.indexes[n] = this.indexes[n] + i.length;
        }
        return this.markDirty(), this;
      }
      cleanRaws(e) {
        if ((super.cleanRaws(e), this.nodes))
          for (let t of this.nodes) t.cleanRaws(e);
      }
      insertBefore(e, t) {
        let i = this.index(e),
          n = i === 0 ? 'prepend' : !1,
          s = this.normalize(t, this.proxyOf.nodes[i], n).reverse();
        i = this.index(e);
        for (let o of s) this.proxyOf.nodes.splice(i, 0, o);
        let a;
        for (let o in this.indexes)
          (a = this.indexes[o]), i <= a && (this.indexes[o] = a + s.length);
        return this.markDirty(), this;
      }
      insertAfter(e, t) {
        let i = this.index(e),
          n = this.normalize(t, this.proxyOf.nodes[i]).reverse();
        i = this.index(e);
        for (let a of n) this.proxyOf.nodes.splice(i + 1, 0, a);
        let s;
        for (let a in this.indexes)
          (s = this.indexes[a]), i < s && (this.indexes[a] = s + n.length);
        return this.markDirty(), this;
      }
      removeChild(e) {
        (e = this.index(e)),
          (this.proxyOf.nodes[e].parent = void 0),
          this.proxyOf.nodes.splice(e, 1);
        let t;
        for (let i in this.indexes)
          (t = this.indexes[i]), t >= e && (this.indexes[i] = t - 1);
        return this.markDirty(), this;
      }
      removeAll() {
        for (let e of this.proxyOf.nodes) e.parent = void 0;
        return (this.proxyOf.nodes = []), this.markDirty(), this;
      }
      replaceValues(e, t, i) {
        return (
          i || ((i = t), (t = {})),
          this.walkDecls((n) => {
            (t.props && !t.props.includes(n.prop)) ||
              (t.fast && !n.value.includes(t.fast)) ||
              (n.value = n.value.replace(e, i));
          }),
          this.markDirty(),
          this
        );
      }
      every(e) {
        return this.nodes.every(e);
      }
      some(e) {
        return this.nodes.some(e);
      }
      index(e) {
        return typeof e == 'number'
          ? e
          : (e.proxyOf && (e = e.proxyOf), this.proxyOf.nodes.indexOf(e));
      }
      get first() {
        if (!!this.proxyOf.nodes) return this.proxyOf.nodes[0];
      }
      get last() {
        if (!!this.proxyOf.nodes)
          return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
      }
      normalize(e, t) {
        if (typeof e == 'string') e = lf(af(e).nodes);
        else if (Array.isArray(e)) {
          e = e.slice(0);
          for (let n of e) n.parent && n.parent.removeChild(n, 'ignore');
        } else if (e.type === 'root' && this.type !== 'document') {
          e = e.nodes.slice(0);
          for (let n of e) n.parent && n.parent.removeChild(n, 'ignore');
        } else if (e.type) e = [e];
        else if (e.prop) {
          if (typeof e.value == 'undefined')
            throw new Error('Value field is missed in node creation');
          typeof e.value != 'string' && (e.value = String(e.value)),
            (e = [new nf(e)]);
        } else if (e.selector) e = [new ys(e)];
        else if (e.name) e = [new bs(e)];
        else if (e.text) e = [new sf(e)];
        else throw new Error('Unknown node type in node creation');
        return e.map(
          (n) => (
            n[rf] || ye.rebuild(n),
            (n = n.proxyOf),
            n.parent && n.parent.removeChild(n),
            n[tf] && uf(n),
            typeof n.raws.before == 'undefined' &&
              t &&
              typeof t.raws.before != 'undefined' &&
              (n.raws.before = t.raws.before.replace(/\S/g, '')),
            (n.parent = this.proxyOf),
            n
          )
        );
      }
      getProxyProcessor() {
        return {
          set(e, t, i) {
            return (
              e[t] === i ||
                ((e[t] = i),
                (t === 'name' || t === 'params' || t === 'selector') &&
                  e.markDirty()),
              !0
            );
          },
          get(e, t) {
            return t === 'proxyOf'
              ? e
              : e[t]
              ? t === 'each' || (typeof t == 'string' && t.startsWith('walk'))
                ? (...i) =>
                    e[t](
                      ...i.map((n) =>
                        typeof n == 'function' ? (s, a) => n(s.toProxy(), a) : n
                      )
                    )
                : t === 'every' || t === 'some'
                ? (i) => e[t]((n, ...s) => i(n.toProxy(), ...s))
                : t === 'root'
                ? () => e.root().toProxy()
                : t === 'nodes'
                ? e.nodes.map((i) => i.toProxy())
                : t === 'first' || t === 'last'
                ? e[t].toProxy()
                : e[t]
              : e[t];
          },
        };
      }
      getIterator() {
        this.lastEach || (this.lastEach = 0),
          this.indexes || (this.indexes = {}),
          (this.lastEach += 1);
        let e = this.lastEach;
        return (this.indexes[e] = 0), e;
      }
    };
    ye.registerParse = (r) => {
      af = r;
    };
    ye.registerRule = (r) => {
      ys = r;
    };
    ye.registerAtRule = (r) => {
      bs = r;
    };
    ye.registerRoot = (r) => {
      of = r;
    };
    ff.exports = ye;
    ye.default = ye;
    ye.rebuild = (r) => {
      r.type === 'atrule'
        ? Object.setPrototypeOf(r, bs.prototype)
        : r.type === 'rule'
        ? Object.setPrototypeOf(r, ys.prototype)
        : r.type === 'decl'
        ? Object.setPrototypeOf(r, nf.prototype)
        : r.type === 'comment'
        ? Object.setPrototypeOf(r, sf.prototype)
        : r.type === 'root' && Object.setPrototypeOf(r, of.prototype),
        (r[rf] = !0),
        r.nodes &&
          r.nodes.forEach((e) => {
            ye.rebuild(e);
          });
    };
  });
  var _i = v((R5, df) => {
    l();
    ('use strict');
    var jw = rt(),
      cf,
      pf,
      _t = class extends jw {
        constructor(e) {
          super({ type: 'document', ...e });
          this.nodes || (this.nodes = []);
        }
        toResult(e = {}) {
          return new cf(new pf(), this, e).stringify();
        }
      };
    _t.registerLazyResult = (r) => {
      cf = r;
    };
    _t.registerProcessor = (r) => {
      pf = r;
    };
    df.exports = _t;
    _t.default = _t;
  });
  var ws = v((M5, mf) => {
    l();
    ('use strict');
    var hf = {};
    mf.exports = function (e) {
      hf[e] ||
        ((hf[e] = !0),
        typeof console != 'undefined' && console.warn && console.warn(e));
    };
  });
  var vs = v((F5, gf) => {
    l();
    ('use strict');
    var Ci = class {
      constructor(e, t = {}) {
        if (
          ((this.type = 'warning'), (this.text = e), t.node && t.node.source)
        ) {
          let i = t.node.rangeBy(t);
          (this.line = i.start.line),
            (this.column = i.start.column),
            (this.endLine = i.end.line),
            (this.endColumn = i.end.column);
        }
        for (let i in t) this[i] = t[i];
      }
      toString() {
        return this.node
          ? this.node.error(this.text, {
              plugin: this.plugin,
              index: this.index,
              word: this.word,
            }).message
          : this.plugin
          ? this.plugin + ': ' + this.text
          : this.text;
      }
    };
    gf.exports = Ci;
    Ci.default = Ci;
  });
  var Oi = v((N5, yf) => {
    l();
    ('use strict');
    var zw = vs(),
      Ai = class {
        constructor(e, t, i) {
          (this.processor = e),
            (this.messages = []),
            (this.root = t),
            (this.opts = i),
            (this.css = void 0),
            (this.map = void 0);
        }
        toString() {
          return this.css;
        }
        warn(e, t = {}) {
          t.plugin ||
            (this.lastPlugin &&
              this.lastPlugin.postcssPlugin &&
              (t.plugin = this.lastPlugin.postcssPlugin));
          let i = new zw(e, t);
          return this.messages.push(i), i;
        }
        warnings() {
          return this.messages.filter((e) => e.type === 'warning');
        }
        get content() {
          return this.css;
        }
      };
    yf.exports = Ai;
    Ai.default = Ai;
  });
  var kf = v((L5, xf) => {
    l();
    ('use strict');
    var xs = "'".charCodeAt(0),
      bf = '"'.charCodeAt(0),
      Ei = '\\'.charCodeAt(0),
      wf = '/'.charCodeAt(0),
      Ti = `
`.charCodeAt(0),
      gr = ' '.charCodeAt(0),
      Pi = '\f'.charCodeAt(0),
      Di = '	'.charCodeAt(0),
      Ii = '\r'.charCodeAt(0),
      Vw = '['.charCodeAt(0),
      Uw = ']'.charCodeAt(0),
      Ww = '('.charCodeAt(0),
      Gw = ')'.charCodeAt(0),
      Hw = '{'.charCodeAt(0),
      Yw = '}'.charCodeAt(0),
      Qw = ';'.charCodeAt(0),
      Jw = '*'.charCodeAt(0),
      Xw = ':'.charCodeAt(0),
      Kw = '@'.charCodeAt(0),
      qi = /[\t\n\f\r "#'()/;[\\\]{}]/g,
      Ri = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g,
      Zw = /.[\n"'(/\\]/,
      vf = /[\da-f]/i;
    xf.exports = function (e, t = {}) {
      let i = e.css.valueOf(),
        n = t.ignoreErrors,
        s,
        a,
        o,
        u,
        c,
        f,
        p,
        d,
        h,
        y,
        x = i.length,
        b = 0,
        w = [],
        k = [];
      function S() {
        return b;
      }
      function _(I) {
        throw e.error('Unclosed ' + I, b);
      }
      function P() {
        return k.length === 0 && b >= x;
      }
      function M(I) {
        if (k.length) return k.pop();
        if (b >= x) return;
        let X = I ? I.ignoreUnclosed : !1;
        switch (((s = i.charCodeAt(b)), s)) {
          case Ti:
          case gr:
          case Di:
          case Ii:
          case Pi: {
            a = b;
            do (a += 1), (s = i.charCodeAt(a));
            while (s === gr || s === Ti || s === Di || s === Ii || s === Pi);
            (y = ['space', i.slice(b, a)]), (b = a - 1);
            break;
          }
          case Vw:
          case Uw:
          case Hw:
          case Yw:
          case Xw:
          case Qw:
          case Gw: {
            let ge = String.fromCharCode(s);
            y = [ge, ge, b];
            break;
          }
          case Ww: {
            if (
              ((d = w.length ? w.pop()[1] : ''),
              (h = i.charCodeAt(b + 1)),
              d === 'url' &&
                h !== xs &&
                h !== bf &&
                h !== gr &&
                h !== Ti &&
                h !== Di &&
                h !== Pi &&
                h !== Ii)
            ) {
              a = b;
              do {
                if (((f = !1), (a = i.indexOf(')', a + 1)), a === -1))
                  if (n || X) {
                    a = b;
                    break;
                  } else _('bracket');
                for (p = a; i.charCodeAt(p - 1) === Ei; ) (p -= 1), (f = !f);
              } while (f);
              (y = ['brackets', i.slice(b, a + 1), b, a]), (b = a);
            } else
              (a = i.indexOf(')', b + 1)),
                (u = i.slice(b, a + 1)),
                a === -1 || Zw.test(u)
                  ? (y = ['(', '(', b])
                  : ((y = ['brackets', u, b, a]), (b = a));
            break;
          }
          case xs:
          case bf: {
            (o = s === xs ? "'" : '"'), (a = b);
            do {
              if (((f = !1), (a = i.indexOf(o, a + 1)), a === -1))
                if (n || X) {
                  a = b + 1;
                  break;
                } else _('string');
              for (p = a; i.charCodeAt(p - 1) === Ei; ) (p -= 1), (f = !f);
            } while (f);
            (y = ['string', i.slice(b, a + 1), b, a]), (b = a);
            break;
          }
          case Kw: {
            (qi.lastIndex = b + 1),
              qi.test(i),
              qi.lastIndex === 0 ? (a = i.length - 1) : (a = qi.lastIndex - 2),
              (y = ['at-word', i.slice(b, a + 1), b, a]),
              (b = a);
            break;
          }
          case Ei: {
            for (a = b, c = !0; i.charCodeAt(a + 1) === Ei; )
              (a += 1), (c = !c);
            if (
              ((s = i.charCodeAt(a + 1)),
              c &&
                s !== wf &&
                s !== gr &&
                s !== Ti &&
                s !== Di &&
                s !== Ii &&
                s !== Pi &&
                ((a += 1), vf.test(i.charAt(a))))
            ) {
              for (; vf.test(i.charAt(a + 1)); ) a += 1;
              i.charCodeAt(a + 1) === gr && (a += 1);
            }
            (y = ['word', i.slice(b, a + 1), b, a]), (b = a);
            break;
          }
          default: {
            s === wf && i.charCodeAt(b + 1) === Jw
              ? ((a = i.indexOf('*/', b + 2) + 1),
                a === 0 && (n || X ? (a = i.length) : _('comment')),
                (y = ['comment', i.slice(b, a + 1), b, a]),
                (b = a))
              : ((Ri.lastIndex = b + 1),
                Ri.test(i),
                Ri.lastIndex === 0
                  ? (a = i.length - 1)
                  : (a = Ri.lastIndex - 2),
                (y = ['word', i.slice(b, a + 1), b, a]),
                w.push(y),
                (b = a));
            break;
          }
        }
        return b++, y;
      }
      function F(I) {
        k.push(I);
      }
      return { back: F, nextToken: M, endOfFile: P, position: S };
    };
  });
  var Mi = v((B5, _f) => {
    l();
    ('use strict');
    var Sf = rt(),
      yr = class extends Sf {
        constructor(e) {
          super(e);
          this.type = 'atrule';
        }
        append(...e) {
          return this.proxyOf.nodes || (this.nodes = []), super.append(...e);
        }
        prepend(...e) {
          return this.proxyOf.nodes || (this.nodes = []), super.prepend(...e);
        }
      };
    _f.exports = yr;
    yr.default = yr;
    Sf.registerAtRule(yr);
  });
  var Ct = v(($5, Ef) => {
    l();
    ('use strict');
    var Cf = rt(),
      Af,
      Of,
      ht = class extends Cf {
        constructor(e) {
          super(e);
          (this.type = 'root'), this.nodes || (this.nodes = []);
        }
        removeChild(e, t) {
          let i = this.index(e);
          return (
            !t &&
              i === 0 &&
              this.nodes.length > 1 &&
              (this.nodes[1].raws.before = this.nodes[i].raws.before),
            super.removeChild(e)
          );
        }
        normalize(e, t, i) {
          let n = super.normalize(e);
          if (t) {
            if (i === 'prepend')
              this.nodes.length > 1
                ? (t.raws.before = this.nodes[1].raws.before)
                : delete t.raws.before;
            else if (this.first !== t)
              for (let s of n) s.raws.before = t.raws.before;
          }
          return n;
        }
        toResult(e = {}) {
          return new Af(new Of(), this, e).stringify();
        }
      };
    ht.registerLazyResult = (r) => {
      Af = r;
    };
    ht.registerProcessor = (r) => {
      Of = r;
    };
    Ef.exports = ht;
    ht.default = ht;
    Cf.registerRoot(ht);
  });
  var ks = v((j5, Tf) => {
    l();
    ('use strict');
    var br = {
      split(r, e, t) {
        let i = [],
          n = '',
          s = !1,
          a = 0,
          o = !1,
          u = '',
          c = !1;
        for (let f of r)
          c
            ? (c = !1)
            : f === '\\'
            ? (c = !0)
            : o
            ? f === u && (o = !1)
            : f === '"' || f === "'"
            ? ((o = !0), (u = f))
            : f === '('
            ? (a += 1)
            : f === ')'
            ? a > 0 && (a -= 1)
            : a === 0 && e.includes(f) && (s = !0),
            s ? (n !== '' && i.push(n.trim()), (n = ''), (s = !1)) : (n += f);
        return (t || n !== '') && i.push(n.trim()), i;
      },
      space(r) {
        let e = [
          ' ',
          `
`,
          '	',
        ];
        return br.split(r, e);
      },
      comma(r) {
        return br.split(r, [','], !0);
      },
    };
    Tf.exports = br;
    br.default = br;
  });
  var Fi = v((z5, Df) => {
    l();
    ('use strict');
    var Pf = rt(),
      e0 = ks(),
      wr = class extends Pf {
        constructor(e) {
          super(e);
          (this.type = 'rule'), this.nodes || (this.nodes = []);
        }
        get selectors() {
          return e0.comma(this.selector);
        }
        set selectors(e) {
          let t = this.selector ? this.selector.match(/,\s*/) : null,
            i = t ? t[0] : ',' + this.raw('between', 'beforeOpen');
          this.selector = e.join(i);
        }
      };
    Df.exports = wr;
    wr.default = wr;
    Pf.registerRule(wr);
  });
  var Ff = v((V5, Mf) => {
    l();
    ('use strict');
    var t0 = hr(),
      r0 = kf(),
      i0 = mr(),
      n0 = Mi(),
      s0 = Ct(),
      If = Fi(),
      qf = { empty: !0, space: !0 };
    function a0(r) {
      for (let e = r.length - 1; e >= 0; e--) {
        let t = r[e],
          i = t[3] || t[2];
        if (i) return i;
      }
    }
    var Rf = class {
      constructor(e) {
        (this.input = e),
          (this.root = new s0()),
          (this.current = this.root),
          (this.spaces = ''),
          (this.semicolon = !1),
          (this.customProperty = !1),
          this.createTokenizer(),
          (this.root.source = {
            input: e,
            start: { offset: 0, line: 1, column: 1 },
          });
      }
      createTokenizer() {
        this.tokenizer = r0(this.input);
      }
      parse() {
        let e;
        for (; !this.tokenizer.endOfFile(); )
          switch (((e = this.tokenizer.nextToken()), e[0])) {
            case 'space':
              this.spaces += e[1];
              break;
            case ';':
              this.freeSemicolon(e);
              break;
            case '}':
              this.end(e);
              break;
            case 'comment':
              this.comment(e);
              break;
            case 'at-word':
              this.atrule(e);
              break;
            case '{':
              this.emptyRule(e);
              break;
            default:
              this.other(e);
              break;
          }
        this.endFile();
      }
      comment(e) {
        let t = new i0();
        this.init(t, e[2]), (t.source.end = this.getPosition(e[3] || e[2]));
        let i = e[1].slice(2, -2);
        if (/^\s*$/.test(i))
          (t.text = ''), (t.raws.left = i), (t.raws.right = '');
        else {
          let n = i.match(/^(\s*)([^]*\S)(\s*)$/);
          (t.text = n[2]), (t.raws.left = n[1]), (t.raws.right = n[3]);
        }
      }
      emptyRule(e) {
        let t = new If();
        this.init(t, e[2]),
          (t.selector = ''),
          (t.raws.between = ''),
          (this.current = t);
      }
      other(e) {
        let t = !1,
          i = null,
          n = !1,
          s = null,
          a = [],
          o = e[1].startsWith('--'),
          u = [],
          c = e;
        for (; c; ) {
          if (((i = c[0]), u.push(c), i === '(' || i === '['))
            s || (s = c), a.push(i === '(' ? ')' : ']');
          else if (o && n && i === '{') s || (s = c), a.push('}');
          else if (a.length === 0)
            if (i === ';')
              if (n) {
                this.decl(u, o);
                return;
              } else break;
            else if (i === '{') {
              this.rule(u);
              return;
            } else if (i === '}') {
              this.tokenizer.back(u.pop()), (t = !0);
              break;
            } else i === ':' && (n = !0);
          else i === a[a.length - 1] && (a.pop(), a.length === 0 && (s = null));
          c = this.tokenizer.nextToken();
        }
        if (
          (this.tokenizer.endOfFile() && (t = !0),
          a.length > 0 && this.unclosedBracket(s),
          t && n)
        ) {
          if (!o)
            for (
              ;
              u.length &&
              ((c = u[u.length - 1][0]), !(c !== 'space' && c !== 'comment'));

            )
              this.tokenizer.back(u.pop());
          this.decl(u, o);
        } else this.unknownWord(u);
      }
      rule(e) {
        e.pop();
        let t = new If();
        this.init(t, e[0][2]),
          (t.raws.between = this.spacesAndCommentsFromEnd(e)),
          this.raw(t, 'selector', e),
          (this.current = t);
      }
      decl(e, t) {
        let i = new t0();
        this.init(i, e[0][2]);
        let n = e[e.length - 1];
        for (
          n[0] === ';' && ((this.semicolon = !0), e.pop()),
            i.source.end = this.getPosition(n[3] || n[2] || a0(e));
          e[0][0] !== 'word';

        )
          e.length === 1 && this.unknownWord(e),
            (i.raws.before += e.shift()[1]);
        for (
          i.source.start = this.getPosition(e[0][2]), i.prop = '';
          e.length;

        ) {
          let c = e[0][0];
          if (c === ':' || c === 'space' || c === 'comment') break;
          i.prop += e.shift()[1];
        }
        i.raws.between = '';
        let s;
        for (; e.length; )
          if (((s = e.shift()), s[0] === ':')) {
            i.raws.between += s[1];
            break;
          } else
            s[0] === 'word' && /\w/.test(s[1]) && this.unknownWord([s]),
              (i.raws.between += s[1]);
        (i.prop[0] === '_' || i.prop[0] === '*') &&
          ((i.raws.before += i.prop[0]), (i.prop = i.prop.slice(1)));
        let a = [],
          o;
        for (
          ;
          e.length && ((o = e[0][0]), !(o !== 'space' && o !== 'comment'));

        )
          a.push(e.shift());
        this.precheckMissedSemicolon(e);
        for (let c = e.length - 1; c >= 0; c--) {
          if (((s = e[c]), s[1].toLowerCase() === '!important')) {
            i.important = !0;
            let f = this.stringFrom(e, c);
            (f = this.spacesFromEnd(e) + f),
              f !== ' !important' && (i.raws.important = f);
            break;
          } else if (s[1].toLowerCase() === 'important') {
            let f = e.slice(0),
              p = '';
            for (let d = c; d > 0; d--) {
              let h = f[d][0];
              if (p.trim().indexOf('!') === 0 && h !== 'space') break;
              p = f.pop()[1] + p;
            }
            p.trim().indexOf('!') === 0 &&
              ((i.important = !0), (i.raws.important = p), (e = f));
          }
          if (s[0] !== 'space' && s[0] !== 'comment') break;
        }
        e.some((c) => c[0] !== 'space' && c[0] !== 'comment') &&
          ((i.raws.between += a.map((c) => c[1]).join('')), (a = [])),
          this.raw(i, 'value', a.concat(e), t),
          i.value.includes(':') && !t && this.checkMissedSemicolon(e);
      }
      atrule(e) {
        let t = new n0();
        (t.name = e[1].slice(1)),
          t.name === '' && this.unnamedAtrule(t, e),
          this.init(t, e[2]);
        let i,
          n,
          s,
          a = !1,
          o = !1,
          u = [],
          c = [];
        for (; !this.tokenizer.endOfFile(); ) {
          if (
            ((e = this.tokenizer.nextToken()),
            (i = e[0]),
            i === '(' || i === '['
              ? c.push(i === '(' ? ')' : ']')
              : i === '{' && c.length > 0
              ? c.push('}')
              : i === c[c.length - 1] && c.pop(),
            c.length === 0)
          )
            if (i === ';') {
              (t.source.end = this.getPosition(e[2])), (this.semicolon = !0);
              break;
            } else if (i === '{') {
              o = !0;
              break;
            } else if (i === '}') {
              if (u.length > 0) {
                for (s = u.length - 1, n = u[s]; n && n[0] === 'space'; )
                  n = u[--s];
                n && (t.source.end = this.getPosition(n[3] || n[2]));
              }
              this.end(e);
              break;
            } else u.push(e);
          else u.push(e);
          if (this.tokenizer.endOfFile()) {
            a = !0;
            break;
          }
        }
        (t.raws.between = this.spacesAndCommentsFromEnd(u)),
          u.length
            ? ((t.raws.afterName = this.spacesAndCommentsFromStart(u)),
              this.raw(t, 'params', u),
              a &&
                ((e = u[u.length - 1]),
                (t.source.end = this.getPosition(e[3] || e[2])),
                (this.spaces = t.raws.between),
                (t.raws.between = '')))
            : ((t.raws.afterName = ''), (t.params = '')),
          o && ((t.nodes = []), (this.current = t));
      }
      end(e) {
        this.current.nodes &&
          this.current.nodes.length &&
          (this.current.raws.semicolon = this.semicolon),
          (this.semicolon = !1),
          (this.current.raws.after =
            (this.current.raws.after || '') + this.spaces),
          (this.spaces = ''),
          this.current.parent
            ? ((this.current.source.end = this.getPosition(e[2])),
              (this.current = this.current.parent))
            : this.unexpectedClose(e);
      }
      endFile() {
        this.current.parent && this.unclosedBlock(),
          this.current.nodes &&
            this.current.nodes.length &&
            (this.current.raws.semicolon = this.semicolon),
          (this.current.raws.after =
            (this.current.raws.after || '') + this.spaces);
      }
      freeSemicolon(e) {
        if (((this.spaces += e[1]), this.current.nodes)) {
          let t = this.current.nodes[this.current.nodes.length - 1];
          t &&
            t.type === 'rule' &&
            !t.raws.ownSemicolon &&
            ((t.raws.ownSemicolon = this.spaces), (this.spaces = ''));
        }
      }
      getPosition(e) {
        let t = this.input.fromOffset(e);
        return { offset: e, line: t.line, column: t.col };
      }
      init(e, t) {
        this.current.push(e),
          (e.source = { start: this.getPosition(t), input: this.input }),
          (e.raws.before = this.spaces),
          (this.spaces = ''),
          e.type !== 'comment' && (this.semicolon = !1);
      }
      raw(e, t, i, n) {
        let s,
          a,
          o = i.length,
          u = '',
          c = !0,
          f,
          p;
        for (let d = 0; d < o; d += 1)
          (s = i[d]),
            (a = s[0]),
            a === 'space' && d === o - 1 && !n
              ? (c = !1)
              : a === 'comment'
              ? ((p = i[d - 1] ? i[d - 1][0] : 'empty'),
                (f = i[d + 1] ? i[d + 1][0] : 'empty'),
                !qf[p] && !qf[f]
                  ? u.slice(-1) === ','
                    ? (c = !1)
                    : (u += s[1])
                  : (c = !1))
              : (u += s[1]);
        if (!c) {
          let d = i.reduce((h, y) => h + y[1], '');
          e.raws[t] = { value: u, raw: d };
        }
        e[t] = u;
      }
      spacesAndCommentsFromEnd(e) {
        let t,
          i = '';
        for (
          ;
          e.length &&
          ((t = e[e.length - 1][0]), !(t !== 'space' && t !== 'comment'));

        )
          i = e.pop()[1] + i;
        return i;
      }
      spacesAndCommentsFromStart(e) {
        let t,
          i = '';
        for (
          ;
          e.length && ((t = e[0][0]), !(t !== 'space' && t !== 'comment'));

        )
          i += e.shift()[1];
        return i;
      }
      spacesFromEnd(e) {
        let t,
          i = '';
        for (; e.length && ((t = e[e.length - 1][0]), t === 'space'); )
          i = e.pop()[1] + i;
        return i;
      }
      stringFrom(e, t) {
        let i = '';
        for (let n = t; n < e.length; n++) i += e[n][1];
        return e.splice(t, e.length - t), i;
      }
      colon(e) {
        let t = 0,
          i,
          n,
          s;
        for (let [a, o] of e.entries()) {
          if (
            ((i = o),
            (n = i[0]),
            n === '(' && (t += 1),
            n === ')' && (t -= 1),
            t === 0 && n === ':')
          )
            if (!s) this.doubleColon(i);
            else {
              if (s[0] === 'word' && s[1] === 'progid') continue;
              return a;
            }
          s = i;
        }
        return !1;
      }
      unclosedBracket(e) {
        throw this.input.error(
          'Unclosed bracket',
          { offset: e[2] },
          { offset: e[2] + 1 }
        );
      }
      unknownWord(e) {
        throw this.input.error(
          'Unknown word',
          { offset: e[0][2] },
          { offset: e[0][2] + e[0][1].length }
        );
      }
      unexpectedClose(e) {
        throw this.input.error(
          'Unexpected }',
          { offset: e[2] },
          { offset: e[2] + 1 }
        );
      }
      unclosedBlock() {
        let e = this.current.source.start;
        throw this.input.error('Unclosed block', e.line, e.column);
      }
      doubleColon(e) {
        throw this.input.error(
          'Double colon',
          { offset: e[2] },
          { offset: e[2] + e[1].length }
        );
      }
      unnamedAtrule(e, t) {
        throw this.input.error(
          'At-rule without name',
          { offset: t[2] },
          { offset: t[2] + t[1].length }
        );
      }
      precheckMissedSemicolon() {}
      checkMissedSemicolon(e) {
        let t = this.colon(e);
        if (t === !1) return;
        let i = 0,
          n;
        for (
          let s = t - 1;
          s >= 0 && ((n = e[s]), !(n[0] !== 'space' && ((i += 1), i === 2)));
          s--
        );
        throw this.input.error(
          'Missed semicolon',
          n[0] === 'word' ? n[3] + 1 : n[2]
        );
      }
    };
    Mf.exports = Rf;
  });
  var Nf = v(() => {
    l();
  });
  var Bf = v((G5, Lf) => {
    l();
    var o0 = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict',
      l0 =
        (r, e = 21) =>
        (t = e) => {
          let i = '',
            n = t;
          for (; n--; ) i += r[(Math.random() * r.length) | 0];
          return i;
        },
      u0 = (r = 21) => {
        let e = '',
          t = r;
        for (; t--; ) e += o0[(Math.random() * 64) | 0];
        return e;
      };
    Lf.exports = { nanoid: u0, customAlphabet: l0 };
  });
  var Ss = v((H5, $f) => {
    l();
    $f.exports = {};
  });
  var Li = v((Y5, Uf) => {
    l();
    ('use strict');
    var { SourceMapConsumer: f0, SourceMapGenerator: c0 } = Nf(),
      { fileURLToPath: jf, pathToFileURL: Ni } = (fs(), Uu),
      { resolve: _s, isAbsolute: Cs } = (dt(), ju),
      { nanoid: p0 } = Bf(),
      As = cs(),
      zf = yi(),
      d0 = Ss(),
      Os = Symbol('fromOffsetCache'),
      h0 = Boolean(f0 && c0),
      Vf = Boolean(_s && Cs),
      vr = class {
        constructor(e, t = {}) {
          if (
            e === null ||
            typeof e == 'undefined' ||
            (typeof e == 'object' && !e.toString)
          )
            throw new Error(`PostCSS received ${e} instead of CSS string`);
          if (
            ((this.css = e.toString()),
            this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE'
              ? ((this.hasBOM = !0), (this.css = this.css.slice(1)))
              : (this.hasBOM = !1),
            t.from &&
              (!Vf || /^\w+:\/\//.test(t.from) || Cs(t.from)
                ? (this.file = t.from)
                : (this.file = _s(t.from))),
            Vf && h0)
          ) {
            let i = new d0(this.css, t);
            if (i.text) {
              this.map = i;
              let n = i.consumer().file;
              !this.file && n && (this.file = this.mapResolve(n));
            }
          }
          this.file || (this.id = '<input css ' + p0(6) + '>'),
            this.map && (this.map.file = this.from);
        }
        fromOffset(e) {
          let t, i;
          if (this[Os]) i = this[Os];
          else {
            let s = this.css.split(`
`);
            i = new Array(s.length);
            let a = 0;
            for (let o = 0, u = s.length; o < u; o++)
              (i[o] = a), (a += s[o].length + 1);
            this[Os] = i;
          }
          t = i[i.length - 1];
          let n = 0;
          if (e >= t) n = i.length - 1;
          else {
            let s = i.length - 2,
              a;
            for (; n < s; )
              if (((a = n + ((s - n) >> 1)), e < i[a])) s = a - 1;
              else if (e >= i[a + 1]) n = a + 1;
              else {
                n = a;
                break;
              }
          }
          return { line: n + 1, col: e - i[n] + 1 };
        }
        error(e, t, i, n = {}) {
          let s, a, o;
          if (t && typeof t == 'object') {
            let c = t,
              f = i;
            if (typeof c.offset == 'number') {
              let p = this.fromOffset(c.offset);
              (t = p.line), (i = p.col);
            } else (t = c.line), (i = c.column);
            if (typeof f.offset == 'number') {
              let p = this.fromOffset(f.offset);
              (a = p.line), (o = p.col);
            } else (a = f.line), (o = f.column);
          } else if (!i) {
            let c = this.fromOffset(t);
            (t = c.line), (i = c.col);
          }
          let u = this.origin(t, i, a, o);
          return (
            u
              ? (s = new zf(
                  e,
                  u.endLine === void 0
                    ? u.line
                    : { line: u.line, column: u.column },
                  u.endLine === void 0
                    ? u.column
                    : { line: u.endLine, column: u.endColumn },
                  u.source,
                  u.file,
                  n.plugin
                ))
              : (s = new zf(
                  e,
                  a === void 0 ? t : { line: t, column: i },
                  a === void 0 ? i : { line: a, column: o },
                  this.css,
                  this.file,
                  n.plugin
                )),
            (s.input = {
              line: t,
              column: i,
              endLine: a,
              endColumn: o,
              source: this.css,
            }),
            this.file &&
              (Ni && (s.input.url = Ni(this.file).toString()),
              (s.input.file = this.file)),
            s
          );
        }
        origin(e, t, i, n) {
          if (!this.map) return !1;
          let s = this.map.consumer(),
            a = s.originalPositionFor({ line: e, column: t });
          if (!a.source) return !1;
          let o;
          typeof i == 'number' &&
            (o = s.originalPositionFor({ line: i, column: n }));
          let u;
          Cs(a.source)
            ? (u = Ni(a.source))
            : (u = new URL(
                a.source,
                this.map.consumer().sourceRoot || Ni(this.map.mapFile)
              ));
          let c = {
            url: u.toString(),
            line: a.line,
            column: a.column,
            endLine: o && o.line,
            endColumn: o && o.column,
          };
          if (u.protocol === 'file:')
            if (jf) c.file = jf(u);
            else
              throw new Error(
                'file: protocol is not available in this PostCSS build'
              );
          let f = s.sourceContentFor(a.source);
          return f && (c.source = f), c;
        }
        mapResolve(e) {
          return /^\w+:\/\//.test(e)
            ? e
            : _s(this.map.consumer().sourceRoot || this.map.root || '.', e);
        }
        get from() {
          return this.file || this.id;
        }
        toJSON() {
          let e = {};
          for (let t of ['hasBOM', 'css', 'file', 'id'])
            this[t] != null && (e[t] = this[t]);
          return (
            this.map &&
              ((e.map = { ...this.map }),
              e.map.consumerCache && (e.map.consumerCache = void 0)),
            e
          );
        }
      };
    Uf.exports = vr;
    vr.default = vr;
    As && As.registerInput && As.registerInput(vr);
  });
  var $i = v((Q5, Wf) => {
    l();
    ('use strict');
    var m0 = rt(),
      g0 = Ff(),
      y0 = Li();
    function Bi(r, e) {
      let t = new y0(r, e),
        i = new g0(t);
      try {
        i.parse();
      } catch (n) {
        throw n;
      }
      return i.root;
    }
    Wf.exports = Bi;
    Bi.default = Bi;
    m0.registerParse(Bi);
  });
  var Ps = v((X5, Qf) => {
    l();
    ('use strict');
    var { isClean: qe, my: b0 } = bi(),
      w0 = gs(),
      v0 = pr(),
      x0 = rt(),
      k0 = _i(),
      J5 = ws(),
      Gf = Oi(),
      S0 = $i(),
      _0 = Ct(),
      C0 = {
        document: 'Document',
        root: 'Root',
        atrule: 'AtRule',
        rule: 'Rule',
        decl: 'Declaration',
        comment: 'Comment',
      },
      A0 = {
        postcssPlugin: !0,
        prepare: !0,
        Once: !0,
        Document: !0,
        Root: !0,
        Declaration: !0,
        Rule: !0,
        AtRule: !0,
        Comment: !0,
        DeclarationExit: !0,
        RuleExit: !0,
        AtRuleExit: !0,
        CommentExit: !0,
        RootExit: !0,
        DocumentExit: !0,
        OnceExit: !0,
      },
      O0 = { postcssPlugin: !0, prepare: !0, Once: !0 },
      At = 0;
    function xr(r) {
      return typeof r == 'object' && typeof r.then == 'function';
    }
    function Hf(r) {
      let e = !1,
        t = C0[r.type];
      return (
        r.type === 'decl'
          ? (e = r.prop.toLowerCase())
          : r.type === 'atrule' && (e = r.name.toLowerCase()),
        e && r.append
          ? [t, t + '-' + e, At, t + 'Exit', t + 'Exit-' + e]
          : e
          ? [t, t + '-' + e, t + 'Exit', t + 'Exit-' + e]
          : r.append
          ? [t, At, t + 'Exit']
          : [t, t + 'Exit']
      );
    }
    function Yf(r) {
      let e;
      return (
        r.type === 'document'
          ? (e = ['Document', At, 'DocumentExit'])
          : r.type === 'root'
          ? (e = ['Root', At, 'RootExit'])
          : (e = Hf(r)),
        {
          node: r,
          events: e,
          eventIndex: 0,
          visitors: [],
          visitorIndex: 0,
          iterator: 0,
        }
      );
    }
    function Es(r) {
      return (r[qe] = !1), r.nodes && r.nodes.forEach((e) => Es(e)), r;
    }
    var Ts = {},
      ze = class {
        constructor(e, t, i) {
          (this.stringified = !1), (this.processed = !1);
          let n;
          if (
            typeof t == 'object' &&
            t !== null &&
            (t.type === 'root' || t.type === 'document')
          )
            n = Es(t);
          else if (t instanceof ze || t instanceof Gf)
            (n = Es(t.root)),
              t.map &&
                (typeof i.map == 'undefined' && (i.map = {}),
                i.map.inline || (i.map.inline = !1),
                (i.map.prev = t.map));
          else {
            let s = S0;
            i.syntax && (s = i.syntax.parse),
              i.parser && (s = i.parser),
              s.parse && (s = s.parse);
            try {
              n = s(t, i);
            } catch (a) {
              (this.processed = !0), (this.error = a);
            }
            n && !n[b0] && x0.rebuild(n);
          }
          (this.result = new Gf(e, n, i)),
            (this.helpers = { ...Ts, result: this.result, postcss: Ts }),
            (this.plugins = this.processor.plugins.map((s) =>
              typeof s == 'object' && s.prepare
                ? { ...s, ...s.prepare(this.result) }
                : s
            ));
        }
        get [Symbol.toStringTag]() {
          return 'LazyResult';
        }
        get processor() {
          return this.result.processor;
        }
        get opts() {
          return this.result.opts;
        }
        get css() {
          return this.stringify().css;
        }
        get content() {
          return this.stringify().content;
        }
        get map() {
          return this.stringify().map;
        }
        get root() {
          return this.sync().root;
        }
        get messages() {
          return this.sync().messages;
        }
        warnings() {
          return this.sync().warnings();
        }
        toString() {
          return this.css;
        }
        then(e, t) {
          return this.async().then(e, t);
        }
        catch(e) {
          return this.async().catch(e);
        }
        finally(e) {
          return this.async().then(e, e);
        }
        async() {
          return this.error
            ? Promise.reject(this.error)
            : this.processed
            ? Promise.resolve(this.result)
            : (this.processing || (this.processing = this.runAsync()),
              this.processing);
        }
        sync() {
          if (this.error) throw this.error;
          if (this.processed) return this.result;
          if (((this.processed = !0), this.processing))
            throw this.getAsyncError();
          for (let e of this.plugins) {
            let t = this.runOnRoot(e);
            if (xr(t)) throw this.getAsyncError();
          }
          if ((this.prepareVisitors(), this.hasListener)) {
            let e = this.result.root;
            for (; !e[qe]; ) (e[qe] = !0), this.walkSync(e);
            if (this.listeners.OnceExit)
              if (e.type === 'document')
                for (let t of e.nodes)
                  this.visitSync(this.listeners.OnceExit, t);
              else this.visitSync(this.listeners.OnceExit, e);
          }
          return this.result;
        }
        stringify() {
          if (this.error) throw this.error;
          if (this.stringified) return this.result;
          (this.stringified = !0), this.sync();
          let e = this.result.opts,
            t = v0;
          e.syntax && (t = e.syntax.stringify),
            e.stringifier && (t = e.stringifier),
            t.stringify && (t = t.stringify);
          let n = new w0(t, this.result.root, this.result.opts).generate();
          return (
            (this.result.css = n[0]), (this.result.map = n[1]), this.result
          );
        }
        walkSync(e) {
          e[qe] = !0;
          let t = Hf(e);
          for (let i of t)
            if (i === At)
              e.nodes &&
                e.each((n) => {
                  n[qe] || this.walkSync(n);
                });
            else {
              let n = this.listeners[i];
              if (n && this.visitSync(n, e.toProxy())) return;
            }
        }
        visitSync(e, t) {
          for (let [i, n] of e) {
            this.result.lastPlugin = i;
            let s;
            try {
              s = n(t, this.helpers);
            } catch (a) {
              throw this.handleError(a, t.proxyOf);
            }
            if (t.type !== 'root' && t.type !== 'document' && !t.parent)
              return !0;
            if (xr(s)) throw this.getAsyncError();
          }
        }
        runOnRoot(e) {
          this.result.lastPlugin = e;
          try {
            if (typeof e == 'object' && e.Once) {
              if (this.result.root.type === 'document') {
                let t = this.result.root.nodes.map((i) =>
                  e.Once(i, this.helpers)
                );
                return xr(t[0]) ? Promise.all(t) : t;
              }
              return e.Once(this.result.root, this.helpers);
            } else if (typeof e == 'function')
              return e(this.result.root, this.result);
          } catch (t) {
            throw this.handleError(t);
          }
        }
        getAsyncError() {
          throw new Error(
            'Use process(css).then(cb) to work with async plugins'
          );
        }
        handleError(e, t) {
          let i = this.result.lastPlugin;
          try {
            t && t.addToError(e),
              (this.error = e),
              e.name === 'CssSyntaxError' && !e.plugin
                ? ((e.plugin = i.postcssPlugin), e.setMessage())
                : i.postcssVersion;
          } catch (n) {
            console && console.error && console.error(n);
          }
          return e;
        }
        async runAsync() {
          this.plugin = 0;
          for (let e = 0; e < this.plugins.length; e++) {
            let t = this.plugins[e],
              i = this.runOnRoot(t);
            if (xr(i))
              try {
                await i;
              } catch (n) {
                throw this.handleError(n);
              }
          }
          if ((this.prepareVisitors(), this.hasListener)) {
            let e = this.result.root;
            for (; !e[qe]; ) {
              e[qe] = !0;
              let t = [Yf(e)];
              for (; t.length > 0; ) {
                let i = this.visitTick(t);
                if (xr(i))
                  try {
                    await i;
                  } catch (n) {
                    let s = t[t.length - 1].node;
                    throw this.handleError(n, s);
                  }
              }
            }
            if (this.listeners.OnceExit)
              for (let [t, i] of this.listeners.OnceExit) {
                this.result.lastPlugin = t;
                try {
                  if (e.type === 'document') {
                    let n = e.nodes.map((s) => i(s, this.helpers));
                    await Promise.all(n);
                  } else await i(e, this.helpers);
                } catch (n) {
                  throw this.handleError(n);
                }
              }
          }
          return (this.processed = !0), this.stringify();
        }
        prepareVisitors() {
          this.listeners = {};
          let e = (t, i, n) => {
            this.listeners[i] || (this.listeners[i] = []),
              this.listeners[i].push([t, n]);
          };
          for (let t of this.plugins)
            if (typeof t == 'object')
              for (let i in t) {
                if (!A0[i] && /^[A-Z]/.test(i))
                  throw new Error(
                    `Unknown event ${i} in ${t.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
                  );
                if (!O0[i])
                  if (typeof t[i] == 'object')
                    for (let n in t[i])
                      n === '*'
                        ? e(t, i, t[i][n])
                        : e(t, i + '-' + n.toLowerCase(), t[i][n]);
                  else typeof t[i] == 'function' && e(t, i, t[i]);
              }
          this.hasListener = Object.keys(this.listeners).length > 0;
        }
        visitTick(e) {
          let t = e[e.length - 1],
            { node: i, visitors: n } = t;
          if (i.type !== 'root' && i.type !== 'document' && !i.parent) {
            e.pop();
            return;
          }
          if (n.length > 0 && t.visitorIndex < n.length) {
            let [a, o] = n[t.visitorIndex];
            (t.visitorIndex += 1),
              t.visitorIndex === n.length &&
                ((t.visitors = []), (t.visitorIndex = 0)),
              (this.result.lastPlugin = a);
            try {
              return o(i.toProxy(), this.helpers);
            } catch (u) {
              throw this.handleError(u, i);
            }
          }
          if (t.iterator !== 0) {
            let a = t.iterator,
              o;
            for (; (o = i.nodes[i.indexes[a]]); )
              if (((i.indexes[a] += 1), !o[qe])) {
                (o[qe] = !0), e.push(Yf(o));
                return;
              }
            (t.iterator = 0), delete i.indexes[a];
          }
          let s = t.events;
          for (; t.eventIndex < s.length; ) {
            let a = s[t.eventIndex];
            if (((t.eventIndex += 1), a === At)) {
              i.nodes &&
                i.nodes.length &&
                ((i[qe] = !0), (t.iterator = i.getIterator()));
              return;
            } else if (this.listeners[a]) {
              t.visitors = this.listeners[a];
              return;
            }
          }
          e.pop();
        }
      };
    ze.registerPostcss = (r) => {
      Ts = r;
    };
    Qf.exports = ze;
    ze.default = ze;
    _0.registerLazyResult(ze);
    k0.registerLazyResult(ze);
  });
  var Xf = v((Z5, Jf) => {
    l();
    ('use strict');
    var E0 = gs(),
      T0 = pr(),
      K5 = ws(),
      P0 = $i(),
      D0 = Oi(),
      ji = class {
        constructor(e, t, i) {
          (t = t.toString()),
            (this.stringified = !1),
            (this._processor = e),
            (this._css = t),
            (this._opts = i),
            (this._map = void 0);
          let n,
            s = T0;
          (this.result = new D0(this._processor, n, this._opts)),
            (this.result.css = t);
          let a = this;
          Object.defineProperty(this.result, 'root', {
            get() {
              return a.root;
            },
          });
          let o = new E0(s, n, this._opts, t);
          if (o.isMap()) {
            let [u, c] = o.generate();
            u && (this.result.css = u), c && (this.result.map = c);
          }
        }
        get [Symbol.toStringTag]() {
          return 'NoWorkResult';
        }
        get processor() {
          return this.result.processor;
        }
        get opts() {
          return this.result.opts;
        }
        get css() {
          return this.result.css;
        }
        get content() {
          return this.result.css;
        }
        get map() {
          return this.result.map;
        }
        get root() {
          if (this._root) return this._root;
          let e,
            t = P0;
          try {
            e = t(this._css, this._opts);
          } catch (i) {
            this.error = i;
          }
          if (this.error) throw this.error;
          return (this._root = e), e;
        }
        get messages() {
          return [];
        }
        warnings() {
          return [];
        }
        toString() {
          return this._css;
        }
        then(e, t) {
          return this.async().then(e, t);
        }
        catch(e) {
          return this.async().catch(e);
        }
        finally(e) {
          return this.async().then(e, e);
        }
        async() {
          return this.error
            ? Promise.reject(this.error)
            : Promise.resolve(this.result);
        }
        sync() {
          if (this.error) throw this.error;
          return this.result;
        }
      };
    Jf.exports = ji;
    ji.default = ji;
  });
  var Zf = v((eT, Kf) => {
    l();
    ('use strict');
    var I0 = Xf(),
      q0 = Ps(),
      R0 = _i(),
      M0 = Ct(),
      Ot = class {
        constructor(e = []) {
          (this.version = '8.4.24'), (this.plugins = this.normalize(e));
        }
        use(e) {
          return (
            (this.plugins = this.plugins.concat(this.normalize([e]))), this
          );
        }
        process(e, t = {}) {
          return this.plugins.length === 0 &&
            typeof t.parser == 'undefined' &&
            typeof t.stringifier == 'undefined' &&
            typeof t.syntax == 'undefined'
            ? new I0(this, e, t)
            : new q0(this, e, t);
        }
        normalize(e) {
          let t = [];
          for (let i of e)
            if (
              (i.postcss === !0 ? (i = i()) : i.postcss && (i = i.postcss),
              typeof i == 'object' && Array.isArray(i.plugins))
            )
              t = t.concat(i.plugins);
            else if (typeof i == 'object' && i.postcssPlugin) t.push(i);
            else if (typeof i == 'function') t.push(i);
            else if (!(typeof i == 'object' && (i.parse || i.stringify)))
              throw new Error(i + ' is not a PostCSS plugin');
          return t;
        }
      };
    Kf.exports = Ot;
    Ot.default = Ot;
    M0.registerProcessor(Ot);
    R0.registerProcessor(Ot);
  });
  var tc = v((tT, ec) => {
    l();
    ('use strict');
    var F0 = hr(),
      N0 = Ss(),
      L0 = mr(),
      B0 = Mi(),
      $0 = Li(),
      j0 = Ct(),
      z0 = Fi();
    function kr(r, e) {
      if (Array.isArray(r)) return r.map((n) => kr(n));
      let { inputs: t, ...i } = r;
      if (t) {
        e = [];
        for (let n of t) {
          let s = { ...n, __proto__: $0.prototype };
          s.map && (s.map = { ...s.map, __proto__: N0.prototype }), e.push(s);
        }
      }
      if ((i.nodes && (i.nodes = r.nodes.map((n) => kr(n, e))), i.source)) {
        let { inputId: n, ...s } = i.source;
        (i.source = s), n != null && (i.source.input = e[n]);
      }
      if (i.type === 'root') return new j0(i);
      if (i.type === 'decl') return new F0(i);
      if (i.type === 'rule') return new z0(i);
      if (i.type === 'comment') return new L0(i);
      if (i.type === 'atrule') return new B0(i);
      throw new Error('Unknown node type: ' + r.type);
    }
    ec.exports = kr;
    kr.default = kr;
  });
  var me = v((rT, lc) => {
    l();
    ('use strict');
    var V0 = yi(),
      rc = hr(),
      U0 = Ps(),
      W0 = rt(),
      Ds = Zf(),
      G0 = pr(),
      H0 = tc(),
      ic = _i(),
      Y0 = vs(),
      nc = mr(),
      sc = Mi(),
      Q0 = Oi(),
      J0 = Li(),
      X0 = $i(),
      K0 = ks(),
      ac = Fi(),
      oc = Ct(),
      Z0 = dr();
    function $(...r) {
      return r.length === 1 && Array.isArray(r[0]) && (r = r[0]), new Ds(r);
    }
    $.plugin = function (e, t) {
      let i = !1;
      function n(...a) {
        console &&
          console.warn &&
          !i &&
          ((i = !0),
          console.warn(
            e +
              `: postcss.plugin was deprecated. Migration guide:
https://evilmartians.com/chronicles/postcss-8-plugin-migration`
          ),
          m.env.LANG &&
            m.env.LANG.startsWith('cn') &&
            console.warn(
              e +
                `: \u91CC\u9762 postcss.plugin \u88AB\u5F03\u7528. \u8FC1\u79FB\u6307\u5357:
https://www.w3ctech.com/topic/2226`
            ));
        let o = t(...a);
        return (o.postcssPlugin = e), (o.postcssVersion = new Ds().version), o;
      }
      let s;
      return (
        Object.defineProperty(n, 'postcss', {
          get() {
            return s || (s = n()), s;
          },
        }),
        (n.process = function (a, o, u) {
          return $([n(u)]).process(a, o);
        }),
        n
      );
    };
    $.stringify = G0;
    $.parse = X0;
    $.fromJSON = H0;
    $.list = K0;
    $.comment = (r) => new nc(r);
    $.atRule = (r) => new sc(r);
    $.decl = (r) => new rc(r);
    $.rule = (r) => new ac(r);
    $.root = (r) => new oc(r);
    $.document = (r) => new ic(r);
    $.CssSyntaxError = V0;
    $.Declaration = rc;
    $.Container = W0;
    $.Processor = Ds;
    $.Document = ic;
    $.Comment = nc;
    $.Warning = Y0;
    $.AtRule = sc;
    $.Result = Q0;
    $.Input = J0;
    $.Rule = ac;
    $.Root = oc;
    $.Node = Z0;
    U0.registerPostcss($);
    lc.exports = $;
    $.default = $;
  });
  var U,
    j,
    iT,
    nT,
    sT,
    aT,
    oT,
    lT,
    uT,
    fT,
    cT,
    pT,
    dT,
    hT,
    mT,
    gT,
    yT,
    bT,
    wT,
    vT,
    xT,
    kT,
    ST,
    _T,
    CT,
    AT,
    it = C(() => {
      l();
      (U = K(me())),
        (j = U.default),
        (iT = U.default.stringify),
        (nT = U.default.fromJSON),
        (sT = U.default.plugin),
        (aT = U.default.parse),
        (oT = U.default.list),
        (lT = U.default.document),
        (uT = U.default.comment),
        (fT = U.default.atRule),
        (cT = U.default.rule),
        (pT = U.default.decl),
        (dT = U.default.root),
        (hT = U.default.CssSyntaxError),
        (mT = U.default.Declaration),
        (gT = U.default.Container),
        (yT = U.default.Processor),
        (bT = U.default.Document),
        (wT = U.default.Comment),
        (vT = U.default.Warning),
        (xT = U.default.AtRule),
        (kT = U.default.Result),
        (ST = U.default.Input),
        (_T = U.default.Rule),
        (CT = U.default.Root),
        (AT = U.default.Node);
    });
  var Is = v((ET, uc) => {
    l();
    uc.exports = function (r, e, t, i, n) {
      for (e = e.split ? e.split('.') : e, i = 0; i < e.length; i++)
        r = r ? r[e[i]] : n;
      return r === n ? t : r;
    };
  });
  var Vi = v((zi, fc) => {
    l();
    ('use strict');
    zi.__esModule = !0;
    zi.default = rv;
    function ev(r) {
      for (
        var e = r.toLowerCase(), t = '', i = !1, n = 0;
        n < 6 && e[n] !== void 0;
        n++
      ) {
        var s = e.charCodeAt(n),
          a = (s >= 97 && s <= 102) || (s >= 48 && s <= 57);
        if (((i = s === 32), !a)) break;
        t += e[n];
      }
      if (t.length !== 0) {
        var o = parseInt(t, 16),
          u = o >= 55296 && o <= 57343;
        return u || o === 0 || o > 1114111
          ? ['\uFFFD', t.length + (i ? 1 : 0)]
          : [String.fromCodePoint(o), t.length + (i ? 1 : 0)];
      }
    }
    var tv = /\\/;
    function rv(r) {
      var e = tv.test(r);
      if (!e) return r;
      for (var t = '', i = 0; i < r.length; i++) {
        if (r[i] === '\\') {
          var n = ev(r.slice(i + 1, i + 7));
          if (n !== void 0) {
            (t += n[0]), (i += n[1]);
            continue;
          }
          if (r[i + 1] === '\\') {
            (t += '\\'), i++;
            continue;
          }
          r.length === i + 1 && (t += r[i]);
          continue;
        }
        t += r[i];
      }
      return t;
    }
    fc.exports = zi.default;
  });
  var pc = v((Ui, cc) => {
    l();
    ('use strict');
    Ui.__esModule = !0;
    Ui.default = iv;
    function iv(r) {
      for (
        var e = arguments.length, t = new Array(e > 1 ? e - 1 : 0), i = 1;
        i < e;
        i++
      )
        t[i - 1] = arguments[i];
      for (; t.length > 0; ) {
        var n = t.shift();
        if (!r[n]) return;
        r = r[n];
      }
      return r;
    }
    cc.exports = Ui.default;
  });
  var hc = v((Wi, dc) => {
    l();
    ('use strict');
    Wi.__esModule = !0;
    Wi.default = nv;
    function nv(r) {
      for (
        var e = arguments.length, t = new Array(e > 1 ? e - 1 : 0), i = 1;
        i < e;
        i++
      )
        t[i - 1] = arguments[i];
      for (; t.length > 0; ) {
        var n = t.shift();
        r[n] || (r[n] = {}), (r = r[n]);
      }
    }
    dc.exports = Wi.default;
  });
  var gc = v((Gi, mc) => {
    l();
    ('use strict');
    Gi.__esModule = !0;
    Gi.default = sv;
    function sv(r) {
      for (var e = '', t = r.indexOf('/*'), i = 0; t >= 0; ) {
        e = e + r.slice(i, t);
        var n = r.indexOf('*/', t + 2);
        if (n < 0) return e;
        (i = n + 2), (t = r.indexOf('/*', i));
      }
      return (e = e + r.slice(i)), e;
    }
    mc.exports = Gi.default;
  });
  var Sr = v((Re) => {
    l();
    ('use strict');
    Re.__esModule = !0;
    Re.unesc = Re.stripComments = Re.getProp = Re.ensureObject = void 0;
    var av = Hi(Vi());
    Re.unesc = av.default;
    var ov = Hi(pc());
    Re.getProp = ov.default;
    var lv = Hi(hc());
    Re.ensureObject = lv.default;
    var uv = Hi(gc());
    Re.stripComments = uv.default;
    function Hi(r) {
      return r && r.__esModule ? r : { default: r };
    }
  });
  var Ve = v((_r, wc) => {
    l();
    ('use strict');
    _r.__esModule = !0;
    _r.default = void 0;
    var yc = Sr();
    function bc(r, e) {
      for (var t = 0; t < e.length; t++) {
        var i = e[t];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          'value' in i && (i.writable = !0),
          Object.defineProperty(r, i.key, i);
      }
    }
    function fv(r, e, t) {
      return (
        e && bc(r.prototype, e),
        t && bc(r, t),
        Object.defineProperty(r, 'prototype', { writable: !1 }),
        r
      );
    }
    var cv = function r(e, t) {
        if (typeof e != 'object' || e === null) return e;
        var i = new e.constructor();
        for (var n in e)
          if (!!e.hasOwnProperty(n)) {
            var s = e[n],
              a = typeof s;
            n === 'parent' && a === 'object'
              ? t && (i[n] = t)
              : s instanceof Array
              ? (i[n] = s.map(function (o) {
                  return r(o, i);
                }))
              : (i[n] = r(s, i));
          }
        return i;
      },
      pv = (function () {
        function r(t) {
          t === void 0 && (t = {}),
            Object.assign(this, t),
            (this.spaces = this.spaces || {}),
            (this.spaces.before = this.spaces.before || ''),
            (this.spaces.after = this.spaces.after || '');
        }
        var e = r.prototype;
        return (
          (e.remove = function () {
            return (
              this.parent && this.parent.removeChild(this),
              (this.parent = void 0),
              this
            );
          }),
          (e.replaceWith = function () {
            if (this.parent) {
              for (var i in arguments)
                this.parent.insertBefore(this, arguments[i]);
              this.remove();
            }
            return this;
          }),
          (e.next = function () {
            return this.parent.at(this.parent.index(this) + 1);
          }),
          (e.prev = function () {
            return this.parent.at(this.parent.index(this) - 1);
          }),
          (e.clone = function (i) {
            i === void 0 && (i = {});
            var n = cv(this);
            for (var s in i) n[s] = i[s];
            return n;
          }),
          (e.appendToPropertyAndEscape = function (i, n, s) {
            this.raws || (this.raws = {});
            var a = this[i],
              o = this.raws[i];
            (this[i] = a + n),
              o || s !== n
                ? (this.raws[i] = (o || a) + s)
                : delete this.raws[i];
          }),
          (e.setPropertyAndEscape = function (i, n, s) {
            this.raws || (this.raws = {}), (this[i] = n), (this.raws[i] = s);
          }),
          (e.setPropertyWithoutEscape = function (i, n) {
            (this[i] = n), this.raws && delete this.raws[i];
          }),
          (e.isAtPosition = function (i, n) {
            if (this.source && this.source.start && this.source.end)
              return !(
                this.source.start.line > i ||
                this.source.end.line < i ||
                (this.source.start.line === i &&
                  this.source.start.column > n) ||
                (this.source.end.line === i && this.source.end.column < n)
              );
          }),
          (e.stringifyProperty = function (i) {
            return (this.raws && this.raws[i]) || this[i];
          }),
          (e.valueToString = function () {
            return String(this.stringifyProperty('value'));
          }),
          (e.toString = function () {
            return [
              this.rawSpaceBefore,
              this.valueToString(),
              this.rawSpaceAfter,
            ].join('');
          }),
          fv(r, [
            {
              key: 'rawSpaceBefore',
              get: function () {
                var i =
                  this.raws && this.raws.spaces && this.raws.spaces.before;
                return (
                  i === void 0 && (i = this.spaces && this.spaces.before),
                  i || ''
                );
              },
              set: function (i) {
                (0, yc.ensureObject)(this, 'raws', 'spaces'),
                  (this.raws.spaces.before = i);
              },
            },
            {
              key: 'rawSpaceAfter',
              get: function () {
                var i = this.raws && this.raws.spaces && this.raws.spaces.after;
                return i === void 0 && (i = this.spaces.after), i || '';
              },
              set: function (i) {
                (0, yc.ensureObject)(this, 'raws', 'spaces'),
                  (this.raws.spaces.after = i);
              },
            },
          ]),
          r
        );
      })();
    _r.default = pv;
    wc.exports = _r.default;
  });
  var ae = v((W) => {
    l();
    ('use strict');
    W.__esModule = !0;
    W.UNIVERSAL =
      W.TAG =
      W.STRING =
      W.SELECTOR =
      W.ROOT =
      W.PSEUDO =
      W.NESTING =
      W.ID =
      W.COMMENT =
      W.COMBINATOR =
      W.CLASS =
      W.ATTRIBUTE =
        void 0;
    var dv = 'tag';
    W.TAG = dv;
    var hv = 'string';
    W.STRING = hv;
    var mv = 'selector';
    W.SELECTOR = mv;
    var gv = 'root';
    W.ROOT = gv;
    var yv = 'pseudo';
    W.PSEUDO = yv;
    var bv = 'nesting';
    W.NESTING = bv;
    var wv = 'id';
    W.ID = wv;
    var vv = 'comment';
    W.COMMENT = vv;
    var xv = 'combinator';
    W.COMBINATOR = xv;
    var kv = 'class';
    W.CLASS = kv;
    var Sv = 'attribute';
    W.ATTRIBUTE = Sv;
    var _v = 'universal';
    W.UNIVERSAL = _v;
  });
  var Yi = v((Cr, Sc) => {
    l();
    ('use strict');
    Cr.__esModule = !0;
    Cr.default = void 0;
    var Cv = Ov(Ve()),
      Ue = Av(ae());
    function vc(r) {
      if (typeof WeakMap != 'function') return null;
      var e = new WeakMap(),
        t = new WeakMap();
      return (vc = function (n) {
        return n ? t : e;
      })(r);
    }
    function Av(r, e) {
      if (!e && r && r.__esModule) return r;
      if (r === null || (typeof r != 'object' && typeof r != 'function'))
        return { default: r };
      var t = vc(e);
      if (t && t.has(r)) return t.get(r);
      var i = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var s in r)
        if (s !== 'default' && Object.prototype.hasOwnProperty.call(r, s)) {
          var a = n ? Object.getOwnPropertyDescriptor(r, s) : null;
          a && (a.get || a.set)
            ? Object.defineProperty(i, s, a)
            : (i[s] = r[s]);
        }
      return (i.default = r), t && t.set(r, i), i;
    }
    function Ov(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function Ev(r, e) {
      var t =
        (typeof Symbol != 'undefined' && r[Symbol.iterator]) || r['@@iterator'];
      if (t) return (t = t.call(r)).next.bind(t);
      if (
        Array.isArray(r) ||
        (t = Tv(r)) ||
        (e && r && typeof r.length == 'number')
      ) {
        t && (r = t);
        var i = 0;
        return function () {
          return i >= r.length ? { done: !0 } : { done: !1, value: r[i++] };
        };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    function Tv(r, e) {
      if (!!r) {
        if (typeof r == 'string') return xc(r, e);
        var t = Object.prototype.toString.call(r).slice(8, -1);
        if (
          (t === 'Object' && r.constructor && (t = r.constructor.name),
          t === 'Map' || t === 'Set')
        )
          return Array.from(r);
        if (
          t === 'Arguments' ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
        )
          return xc(r, e);
      }
    }
    function xc(r, e) {
      (e == null || e > r.length) && (e = r.length);
      for (var t = 0, i = new Array(e); t < e; t++) i[t] = r[t];
      return i;
    }
    function kc(r, e) {
      for (var t = 0; t < e.length; t++) {
        var i = e[t];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          'value' in i && (i.writable = !0),
          Object.defineProperty(r, i.key, i);
      }
    }
    function Pv(r, e, t) {
      return (
        e && kc(r.prototype, e),
        t && kc(r, t),
        Object.defineProperty(r, 'prototype', { writable: !1 }),
        r
      );
    }
    function Dv(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        qs(r, e);
    }
    function qs(r, e) {
      return (
        (qs = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        qs(r, e)
      );
    }
    var Iv = (function (r) {
      Dv(e, r);
      function e(i) {
        var n;
        return (n = r.call(this, i) || this), n.nodes || (n.nodes = []), n;
      }
      var t = e.prototype;
      return (
        (t.append = function (n) {
          return (n.parent = this), this.nodes.push(n), this;
        }),
        (t.prepend = function (n) {
          return (n.parent = this), this.nodes.unshift(n), this;
        }),
        (t.at = function (n) {
          return this.nodes[n];
        }),
        (t.index = function (n) {
          return typeof n == 'number' ? n : this.nodes.indexOf(n);
        }),
        (t.removeChild = function (n) {
          (n = this.index(n)),
            (this.at(n).parent = void 0),
            this.nodes.splice(n, 1);
          var s;
          for (var a in this.indexes)
            (s = this.indexes[a]), s >= n && (this.indexes[a] = s - 1);
          return this;
        }),
        (t.removeAll = function () {
          for (var n = Ev(this.nodes), s; !(s = n()).done; ) {
            var a = s.value;
            a.parent = void 0;
          }
          return (this.nodes = []), this;
        }),
        (t.empty = function () {
          return this.removeAll();
        }),
        (t.insertAfter = function (n, s) {
          s.parent = this;
          var a = this.index(n);
          this.nodes.splice(a + 1, 0, s), (s.parent = this);
          var o;
          for (var u in this.indexes)
            (o = this.indexes[u]), a <= o && (this.indexes[u] = o + 1);
          return this;
        }),
        (t.insertBefore = function (n, s) {
          s.parent = this;
          var a = this.index(n);
          this.nodes.splice(a, 0, s), (s.parent = this);
          var o;
          for (var u in this.indexes)
            (o = this.indexes[u]), o <= a && (this.indexes[u] = o + 1);
          return this;
        }),
        (t._findChildAtPosition = function (n, s) {
          var a = void 0;
          return (
            this.each(function (o) {
              if (o.atPosition) {
                var u = o.atPosition(n, s);
                if (u) return (a = u), !1;
              } else if (o.isAtPosition(n, s)) return (a = o), !1;
            }),
            a
          );
        }),
        (t.atPosition = function (n, s) {
          if (this.isAtPosition(n, s))
            return this._findChildAtPosition(n, s) || this;
        }),
        (t._inferEndPosition = function () {
          this.last &&
            this.last.source &&
            this.last.source.end &&
            ((this.source = this.source || {}),
            (this.source.end = this.source.end || {}),
            Object.assign(this.source.end, this.last.source.end));
        }),
        (t.each = function (n) {
          this.lastEach || (this.lastEach = 0),
            this.indexes || (this.indexes = {}),
            this.lastEach++;
          var s = this.lastEach;
          if (((this.indexes[s] = 0), !!this.length)) {
            for (
              var a, o;
              this.indexes[s] < this.length &&
              ((a = this.indexes[s]), (o = n(this.at(a), a)), o !== !1);

            )
              this.indexes[s] += 1;
            if ((delete this.indexes[s], o === !1)) return !1;
          }
        }),
        (t.walk = function (n) {
          return this.each(function (s, a) {
            var o = n(s, a);
            if ((o !== !1 && s.length && (o = s.walk(n)), o === !1)) return !1;
          });
        }),
        (t.walkAttributes = function (n) {
          var s = this;
          return this.walk(function (a) {
            if (a.type === Ue.ATTRIBUTE) return n.call(s, a);
          });
        }),
        (t.walkClasses = function (n) {
          var s = this;
          return this.walk(function (a) {
            if (a.type === Ue.CLASS) return n.call(s, a);
          });
        }),
        (t.walkCombinators = function (n) {
          var s = this;
          return this.walk(function (a) {
            if (a.type === Ue.COMBINATOR) return n.call(s, a);
          });
        }),
        (t.walkComments = function (n) {
          var s = this;
          return this.walk(function (a) {
            if (a.type === Ue.COMMENT) return n.call(s, a);
          });
        }),
        (t.walkIds = function (n) {
          var s = this;
          return this.walk(function (a) {
            if (a.type === Ue.ID) return n.call(s, a);
          });
        }),
        (t.walkNesting = function (n) {
          var s = this;
          return this.walk(function (a) {
            if (a.type === Ue.NESTING) return n.call(s, a);
          });
        }),
        (t.walkPseudos = function (n) {
          var s = this;
          return this.walk(function (a) {
            if (a.type === Ue.PSEUDO) return n.call(s, a);
          });
        }),
        (t.walkTags = function (n) {
          var s = this;
          return this.walk(function (a) {
            if (a.type === Ue.TAG) return n.call(s, a);
          });
        }),
        (t.walkUniversals = function (n) {
          var s = this;
          return this.walk(function (a) {
            if (a.type === Ue.UNIVERSAL) return n.call(s, a);
          });
        }),
        (t.split = function (n) {
          var s = this,
            a = [];
          return this.reduce(function (o, u, c) {
            var f = n.call(s, u);
            return (
              a.push(u),
              f ? (o.push(a), (a = [])) : c === s.length - 1 && o.push(a),
              o
            );
          }, []);
        }),
        (t.map = function (n) {
          return this.nodes.map(n);
        }),
        (t.reduce = function (n, s) {
          return this.nodes.reduce(n, s);
        }),
        (t.every = function (n) {
          return this.nodes.every(n);
        }),
        (t.some = function (n) {
          return this.nodes.some(n);
        }),
        (t.filter = function (n) {
          return this.nodes.filter(n);
        }),
        (t.sort = function (n) {
          return this.nodes.sort(n);
        }),
        (t.toString = function () {
          return this.map(String).join('');
        }),
        Pv(e, [
          {
            key: 'first',
            get: function () {
              return this.at(0);
            },
          },
          {
            key: 'last',
            get: function () {
              return this.at(this.length - 1);
            },
          },
          {
            key: 'length',
            get: function () {
              return this.nodes.length;
            },
          },
        ]),
        e
      );
    })(Cv.default);
    Cr.default = Iv;
    Sc.exports = Cr.default;
  });
  var Ms = v((Ar, Cc) => {
    l();
    ('use strict');
    Ar.__esModule = !0;
    Ar.default = void 0;
    var qv = Mv(Yi()),
      Rv = ae();
    function Mv(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function _c(r, e) {
      for (var t = 0; t < e.length; t++) {
        var i = e[t];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          'value' in i && (i.writable = !0),
          Object.defineProperty(r, i.key, i);
      }
    }
    function Fv(r, e, t) {
      return (
        e && _c(r.prototype, e),
        t && _c(r, t),
        Object.defineProperty(r, 'prototype', { writable: !1 }),
        r
      );
    }
    function Nv(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        Rs(r, e);
    }
    function Rs(r, e) {
      return (
        (Rs = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Rs(r, e)
      );
    }
    var Lv = (function (r) {
      Nv(e, r);
      function e(i) {
        var n;
        return (n = r.call(this, i) || this), (n.type = Rv.ROOT), n;
      }
      var t = e.prototype;
      return (
        (t.toString = function () {
          var n = this.reduce(function (s, a) {
            return s.push(String(a)), s;
          }, []).join(',');
          return this.trailingComma ? n + ',' : n;
        }),
        (t.error = function (n, s) {
          return this._error ? this._error(n, s) : new Error(n);
        }),
        Fv(e, [
          {
            key: 'errorGenerator',
            set: function (n) {
              this._error = n;
            },
          },
        ]),
        e
      );
    })(qv.default);
    Ar.default = Lv;
    Cc.exports = Ar.default;
  });
  var Ns = v((Or, Ac) => {
    l();
    ('use strict');
    Or.__esModule = !0;
    Or.default = void 0;
    var Bv = jv(Yi()),
      $v = ae();
    function jv(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function zv(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        Fs(r, e);
    }
    function Fs(r, e) {
      return (
        (Fs = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Fs(r, e)
      );
    }
    var Vv = (function (r) {
      zv(e, r);
      function e(t) {
        var i;
        return (i = r.call(this, t) || this), (i.type = $v.SELECTOR), i;
      }
      return e;
    })(Bv.default);
    Or.default = Vv;
    Ac.exports = Or.default;
  });
  var Qi = v((DT, Oc) => {
    l();
    ('use strict');
    var Uv = {},
      Wv = Uv.hasOwnProperty,
      Gv = function (e, t) {
        if (!e) return t;
        var i = {};
        for (var n in t) i[n] = Wv.call(e, n) ? e[n] : t[n];
        return i;
      },
      Hv = /[ -,\.\/:-@\[-\^`\{-~]/,
      Yv = /[ -,\.\/:-@\[\]\^`\{-~]/,
      Qv = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g,
      Ls = function r(e, t) {
        (t = Gv(t, r.options)),
          t.quotes != 'single' && t.quotes != 'double' && (t.quotes = 'single');
        for (
          var i = t.quotes == 'double' ? '"' : "'",
            n = t.isIdentifier,
            s = e.charAt(0),
            a = '',
            o = 0,
            u = e.length;
          o < u;

        ) {
          var c = e.charAt(o++),
            f = c.charCodeAt(),
            p = void 0;
          if (f < 32 || f > 126) {
            if (f >= 55296 && f <= 56319 && o < u) {
              var d = e.charCodeAt(o++);
              (d & 64512) == 56320
                ? (f = ((f & 1023) << 10) + (d & 1023) + 65536)
                : o--;
            }
            p = '\\' + f.toString(16).toUpperCase() + ' ';
          } else
            t.escapeEverything
              ? Hv.test(c)
                ? (p = '\\' + c)
                : (p = '\\' + f.toString(16).toUpperCase() + ' ')
              : /[\t\n\f\r\x0B]/.test(c)
              ? (p = '\\' + f.toString(16).toUpperCase() + ' ')
              : c == '\\' ||
                (!n && ((c == '"' && i == c) || (c == "'" && i == c))) ||
                (n && Yv.test(c))
              ? (p = '\\' + c)
              : (p = c);
          a += p;
        }
        return (
          n &&
            (/^-[-\d]/.test(a)
              ? (a = '\\-' + a.slice(1))
              : /\d/.test(s) && (a = '\\3' + s + ' ' + a.slice(1))),
          (a = a.replace(Qv, function (h, y, x) {
            return y && y.length % 2 ? h : (y || '') + x;
          })),
          !n && t.wrap ? i + a + i : a
        );
      };
    Ls.options = {
      escapeEverything: !1,
      isIdentifier: !1,
      quotes: 'single',
      wrap: !1,
    };
    Ls.version = '3.0.0';
    Oc.exports = Ls;
  });
  var $s = v((Er, Pc) => {
    l();
    ('use strict');
    Er.__esModule = !0;
    Er.default = void 0;
    var Jv = Ec(Qi()),
      Xv = Sr(),
      Kv = Ec(Ve()),
      Zv = ae();
    function Ec(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function Tc(r, e) {
      for (var t = 0; t < e.length; t++) {
        var i = e[t];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          'value' in i && (i.writable = !0),
          Object.defineProperty(r, i.key, i);
      }
    }
    function ex(r, e, t) {
      return (
        e && Tc(r.prototype, e),
        t && Tc(r, t),
        Object.defineProperty(r, 'prototype', { writable: !1 }),
        r
      );
    }
    function tx(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        Bs(r, e);
    }
    function Bs(r, e) {
      return (
        (Bs = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Bs(r, e)
      );
    }
    var rx = (function (r) {
      tx(e, r);
      function e(i) {
        var n;
        return (
          (n = r.call(this, i) || this),
          (n.type = Zv.CLASS),
          (n._constructed = !0),
          n
        );
      }
      var t = e.prototype;
      return (
        (t.valueToString = function () {
          return '.' + r.prototype.valueToString.call(this);
        }),
        ex(e, [
          {
            key: 'value',
            get: function () {
              return this._value;
            },
            set: function (n) {
              if (this._constructed) {
                var s = (0, Jv.default)(n, { isIdentifier: !0 });
                s !== n
                  ? ((0, Xv.ensureObject)(this, 'raws'), (this.raws.value = s))
                  : this.raws && delete this.raws.value;
              }
              this._value = n;
            },
          },
        ]),
        e
      );
    })(Kv.default);
    Er.default = rx;
    Pc.exports = Er.default;
  });
  var zs = v((Tr, Dc) => {
    l();
    ('use strict');
    Tr.__esModule = !0;
    Tr.default = void 0;
    var ix = sx(Ve()),
      nx = ae();
    function sx(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function ax(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        js(r, e);
    }
    function js(r, e) {
      return (
        (js = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        js(r, e)
      );
    }
    var ox = (function (r) {
      ax(e, r);
      function e(t) {
        var i;
        return (i = r.call(this, t) || this), (i.type = nx.COMMENT), i;
      }
      return e;
    })(ix.default);
    Tr.default = ox;
    Dc.exports = Tr.default;
  });
  var Us = v((Pr, Ic) => {
    l();
    ('use strict');
    Pr.__esModule = !0;
    Pr.default = void 0;
    var lx = fx(Ve()),
      ux = ae();
    function fx(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function cx(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        Vs(r, e);
    }
    function Vs(r, e) {
      return (
        (Vs = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Vs(r, e)
      );
    }
    var px = (function (r) {
      cx(e, r);
      function e(i) {
        var n;
        return (n = r.call(this, i) || this), (n.type = ux.ID), n;
      }
      var t = e.prototype;
      return (
        (t.valueToString = function () {
          return '#' + r.prototype.valueToString.call(this);
        }),
        e
      );
    })(lx.default);
    Pr.default = px;
    Ic.exports = Pr.default;
  });
  var Ji = v((Dr, Mc) => {
    l();
    ('use strict');
    Dr.__esModule = !0;
    Dr.default = void 0;
    var dx = qc(Qi()),
      hx = Sr(),
      mx = qc(Ve());
    function qc(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function Rc(r, e) {
      for (var t = 0; t < e.length; t++) {
        var i = e[t];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          'value' in i && (i.writable = !0),
          Object.defineProperty(r, i.key, i);
      }
    }
    function gx(r, e, t) {
      return (
        e && Rc(r.prototype, e),
        t && Rc(r, t),
        Object.defineProperty(r, 'prototype', { writable: !1 }),
        r
      );
    }
    function yx(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        Ws(r, e);
    }
    function Ws(r, e) {
      return (
        (Ws = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Ws(r, e)
      );
    }
    var bx = (function (r) {
      yx(e, r);
      function e() {
        return r.apply(this, arguments) || this;
      }
      var t = e.prototype;
      return (
        (t.qualifiedName = function (n) {
          return this.namespace ? this.namespaceString + '|' + n : n;
        }),
        (t.valueToString = function () {
          return this.qualifiedName(r.prototype.valueToString.call(this));
        }),
        gx(e, [
          {
            key: 'namespace',
            get: function () {
              return this._namespace;
            },
            set: function (n) {
              if (n === !0 || n === '*' || n === '&') {
                (this._namespace = n), this.raws && delete this.raws.namespace;
                return;
              }
              var s = (0, dx.default)(n, { isIdentifier: !0 });
              (this._namespace = n),
                s !== n
                  ? ((0, hx.ensureObject)(this, 'raws'),
                    (this.raws.namespace = s))
                  : this.raws && delete this.raws.namespace;
            },
          },
          {
            key: 'ns',
            get: function () {
              return this._namespace;
            },
            set: function (n) {
              this.namespace = n;
            },
          },
          {
            key: 'namespaceString',
            get: function () {
              if (this.namespace) {
                var n = this.stringifyProperty('namespace');
                return n === !0 ? '' : n;
              } else return '';
            },
          },
        ]),
        e
      );
    })(mx.default);
    Dr.default = bx;
    Mc.exports = Dr.default;
  });
  var Hs = v((Ir, Fc) => {
    l();
    ('use strict');
    Ir.__esModule = !0;
    Ir.default = void 0;
    var wx = xx(Ji()),
      vx = ae();
    function xx(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function kx(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        Gs(r, e);
    }
    function Gs(r, e) {
      return (
        (Gs = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Gs(r, e)
      );
    }
    var Sx = (function (r) {
      kx(e, r);
      function e(t) {
        var i;
        return (i = r.call(this, t) || this), (i.type = vx.TAG), i;
      }
      return e;
    })(wx.default);
    Ir.default = Sx;
    Fc.exports = Ir.default;
  });
  var Qs = v((qr, Nc) => {
    l();
    ('use strict');
    qr.__esModule = !0;
    qr.default = void 0;
    var _x = Ax(Ve()),
      Cx = ae();
    function Ax(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function Ox(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        Ys(r, e);
    }
    function Ys(r, e) {
      return (
        (Ys = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Ys(r, e)
      );
    }
    var Ex = (function (r) {
      Ox(e, r);
      function e(t) {
        var i;
        return (i = r.call(this, t) || this), (i.type = Cx.STRING), i;
      }
      return e;
    })(_x.default);
    qr.default = Ex;
    Nc.exports = qr.default;
  });
  var Xs = v((Rr, Lc) => {
    l();
    ('use strict');
    Rr.__esModule = !0;
    Rr.default = void 0;
    var Tx = Dx(Yi()),
      Px = ae();
    function Dx(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function Ix(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        Js(r, e);
    }
    function Js(r, e) {
      return (
        (Js = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        Js(r, e)
      );
    }
    var qx = (function (r) {
      Ix(e, r);
      function e(i) {
        var n;
        return (n = r.call(this, i) || this), (n.type = Px.PSEUDO), n;
      }
      var t = e.prototype;
      return (
        (t.toString = function () {
          var n = this.length ? '(' + this.map(String).join(',') + ')' : '';
          return [
            this.rawSpaceBefore,
            this.stringifyProperty('value'),
            n,
            this.rawSpaceAfter,
          ].join('');
        }),
        e
      );
    })(Tx.default);
    Rr.default = qx;
    Lc.exports = Rr.default;
  });
  var Bc = {};
  Ce(Bc, { deprecate: () => Rx });
  function Rx(r) {
    return r;
  }
  var $c = C(() => {
    l();
  });
  var zc = v((IT, jc) => {
    l();
    jc.exports = ($c(), Bc).deprecate;
  });
  var ia = v((Nr) => {
    l();
    ('use strict');
    Nr.__esModule = !0;
    Nr.default = void 0;
    Nr.unescapeValue = ta;
    var Mr = Zs(Qi()),
      Mx = Zs(Vi()),
      Fx = Zs(Ji()),
      Nx = ae(),
      Ks;
    function Zs(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function Vc(r, e) {
      for (var t = 0; t < e.length; t++) {
        var i = e[t];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          'value' in i && (i.writable = !0),
          Object.defineProperty(r, i.key, i);
      }
    }
    function Lx(r, e, t) {
      return (
        e && Vc(r.prototype, e),
        t && Vc(r, t),
        Object.defineProperty(r, 'prototype', { writable: !1 }),
        r
      );
    }
    function Bx(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        ea(r, e);
    }
    function ea(r, e) {
      return (
        (ea = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        ea(r, e)
      );
    }
    var Fr = zc(),
      $x = /^('|")([^]*)\1$/,
      jx = Fr(function () {},
      'Assigning an attribute a value containing characters that might need to be escaped is deprecated. Call attribute.setValue() instead.'),
      zx = Fr(function () {},
      'Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead.'),
      Vx = Fr(function () {},
      'Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.');
    function ta(r) {
      var e = !1,
        t = null,
        i = r,
        n = i.match($x);
      return (
        n && ((t = n[1]), (i = n[2])),
        (i = (0, Mx.default)(i)),
        i !== r && (e = !0),
        { deprecatedUsage: e, unescaped: i, quoteMark: t }
      );
    }
    function Ux(r) {
      if (r.quoteMark !== void 0 || r.value === void 0) return r;
      Vx();
      var e = ta(r.value),
        t = e.quoteMark,
        i = e.unescaped;
      return (
        r.raws || (r.raws = {}),
        r.raws.value === void 0 && (r.raws.value = r.value),
        (r.value = i),
        (r.quoteMark = t),
        r
      );
    }
    var Xi = (function (r) {
      Bx(e, r);
      function e(i) {
        var n;
        return (
          i === void 0 && (i = {}),
          (n = r.call(this, Ux(i)) || this),
          (n.type = Nx.ATTRIBUTE),
          (n.raws = n.raws || {}),
          Object.defineProperty(n.raws, 'unquoted', {
            get: Fr(function () {
              return n.value;
            }, 'attr.raws.unquoted is deprecated. Call attr.value instead.'),
            set: Fr(function () {
              return n.value;
            }, 'Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now.'),
          }),
          (n._constructed = !0),
          n
        );
      }
      var t = e.prototype;
      return (
        (t.getQuotedValue = function (n) {
          n === void 0 && (n = {});
          var s = this._determineQuoteMark(n),
            a = ra[s],
            o = (0, Mr.default)(this._value, a);
          return o;
        }),
        (t._determineQuoteMark = function (n) {
          return n.smart ? this.smartQuoteMark(n) : this.preferredQuoteMark(n);
        }),
        (t.setValue = function (n, s) {
          s === void 0 && (s = {}),
            (this._value = n),
            (this._quoteMark = this._determineQuoteMark(s)),
            this._syncRawValue();
        }),
        (t.smartQuoteMark = function (n) {
          var s = this.value,
            a = s.replace(/[^']/g, '').length,
            o = s.replace(/[^"]/g, '').length;
          if (a + o === 0) {
            var u = (0, Mr.default)(s, { isIdentifier: !0 });
            if (u === s) return e.NO_QUOTE;
            var c = this.preferredQuoteMark(n);
            if (c === e.NO_QUOTE) {
              var f = this.quoteMark || n.quoteMark || e.DOUBLE_QUOTE,
                p = ra[f],
                d = (0, Mr.default)(s, p);
              if (d.length < u.length) return f;
            }
            return c;
          } else
            return o === a
              ? this.preferredQuoteMark(n)
              : o < a
              ? e.DOUBLE_QUOTE
              : e.SINGLE_QUOTE;
        }),
        (t.preferredQuoteMark = function (n) {
          var s = n.preferCurrentQuoteMark ? this.quoteMark : n.quoteMark;
          return (
            s === void 0 &&
              (s = n.preferCurrentQuoteMark ? n.quoteMark : this.quoteMark),
            s === void 0 && (s = e.DOUBLE_QUOTE),
            s
          );
        }),
        (t._syncRawValue = function () {
          var n = (0, Mr.default)(this._value, ra[this.quoteMark]);
          n === this._value
            ? this.raws && delete this.raws.value
            : (this.raws.value = n);
        }),
        (t._handleEscapes = function (n, s) {
          if (this._constructed) {
            var a = (0, Mr.default)(s, { isIdentifier: !0 });
            a !== s ? (this.raws[n] = a) : delete this.raws[n];
          }
        }),
        (t._spacesFor = function (n) {
          var s = { before: '', after: '' },
            a = this.spaces[n] || {},
            o = (this.raws.spaces && this.raws.spaces[n]) || {};
          return Object.assign(s, a, o);
        }),
        (t._stringFor = function (n, s, a) {
          s === void 0 && (s = n), a === void 0 && (a = Uc);
          var o = this._spacesFor(s);
          return a(this.stringifyProperty(n), o);
        }),
        (t.offsetOf = function (n) {
          var s = 1,
            a = this._spacesFor('attribute');
          if (((s += a.before.length), n === 'namespace' || n === 'ns'))
            return this.namespace ? s : -1;
          if (
            n === 'attributeNS' ||
            ((s += this.namespaceString.length),
            this.namespace && (s += 1),
            n === 'attribute')
          )
            return s;
          (s += this.stringifyProperty('attribute').length),
            (s += a.after.length);
          var o = this._spacesFor('operator');
          s += o.before.length;
          var u = this.stringifyProperty('operator');
          if (n === 'operator') return u ? s : -1;
          (s += u.length), (s += o.after.length);
          var c = this._spacesFor('value');
          s += c.before.length;
          var f = this.stringifyProperty('value');
          if (n === 'value') return f ? s : -1;
          (s += f.length), (s += c.after.length);
          var p = this._spacesFor('insensitive');
          return (
            (s += p.before.length),
            n === 'insensitive' && this.insensitive ? s : -1
          );
        }),
        (t.toString = function () {
          var n = this,
            s = [this.rawSpaceBefore, '['];
          return (
            s.push(this._stringFor('qualifiedAttribute', 'attribute')),
            this.operator &&
              (this.value || this.value === '') &&
              (s.push(this._stringFor('operator')),
              s.push(this._stringFor('value')),
              s.push(
                this._stringFor(
                  'insensitiveFlag',
                  'insensitive',
                  function (a, o) {
                    return (
                      a.length > 0 &&
                        !n.quoted &&
                        o.before.length === 0 &&
                        !(n.spaces.value && n.spaces.value.after) &&
                        (o.before = ' '),
                      Uc(a, o)
                    );
                  }
                )
              )),
            s.push(']'),
            s.push(this.rawSpaceAfter),
            s.join('')
          );
        }),
        Lx(e, [
          {
            key: 'quoted',
            get: function () {
              var n = this.quoteMark;
              return n === "'" || n === '"';
            },
            set: function (n) {
              zx();
            },
          },
          {
            key: 'quoteMark',
            get: function () {
              return this._quoteMark;
            },
            set: function (n) {
              if (!this._constructed) {
                this._quoteMark = n;
                return;
              }
              this._quoteMark !== n &&
                ((this._quoteMark = n), this._syncRawValue());
            },
          },
          {
            key: 'qualifiedAttribute',
            get: function () {
              return this.qualifiedName(this.raws.attribute || this.attribute);
            },
          },
          {
            key: 'insensitiveFlag',
            get: function () {
              return this.insensitive ? 'i' : '';
            },
          },
          {
            key: 'value',
            get: function () {
              return this._value;
            },
            set: function (n) {
              if (this._constructed) {
                var s = ta(n),
                  a = s.deprecatedUsage,
                  o = s.unescaped,
                  u = s.quoteMark;
                if ((a && jx(), o === this._value && u === this._quoteMark))
                  return;
                (this._value = o), (this._quoteMark = u), this._syncRawValue();
              } else this._value = n;
            },
          },
          {
            key: 'insensitive',
            get: function () {
              return this._insensitive;
            },
            set: function (n) {
              n ||
                ((this._insensitive = !1),
                this.raws &&
                  (this.raws.insensitiveFlag === 'I' ||
                    this.raws.insensitiveFlag === 'i') &&
                  (this.raws.insensitiveFlag = void 0)),
                (this._insensitive = n);
            },
          },
          {
            key: 'attribute',
            get: function () {
              return this._attribute;
            },
            set: function (n) {
              this._handleEscapes('attribute', n), (this._attribute = n);
            },
          },
        ]),
        e
      );
    })(Fx.default);
    Nr.default = Xi;
    Xi.NO_QUOTE = null;
    Xi.SINGLE_QUOTE = "'";
    Xi.DOUBLE_QUOTE = '"';
    var ra =
      ((Ks = {
        "'": { quotes: 'single', wrap: !0 },
        '"': { quotes: 'double', wrap: !0 },
      }),
      (Ks[null] = { isIdentifier: !0 }),
      Ks);
    function Uc(r, e) {
      return '' + e.before + r + e.after;
    }
  });
  var sa = v((Lr, Wc) => {
    l();
    ('use strict');
    Lr.__esModule = !0;
    Lr.default = void 0;
    var Wx = Hx(Ji()),
      Gx = ae();
    function Hx(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function Yx(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        na(r, e);
    }
    function na(r, e) {
      return (
        (na = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        na(r, e)
      );
    }
    var Qx = (function (r) {
      Yx(e, r);
      function e(t) {
        var i;
        return (
          (i = r.call(this, t) || this),
          (i.type = Gx.UNIVERSAL),
          (i.value = '*'),
          i
        );
      }
      return e;
    })(Wx.default);
    Lr.default = Qx;
    Wc.exports = Lr.default;
  });
  var oa = v((Br, Gc) => {
    l();
    ('use strict');
    Br.__esModule = !0;
    Br.default = void 0;
    var Jx = Kx(Ve()),
      Xx = ae();
    function Kx(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function Zx(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        aa(r, e);
    }
    function aa(r, e) {
      return (
        (aa = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        aa(r, e)
      );
    }
    var e1 = (function (r) {
      Zx(e, r);
      function e(t) {
        var i;
        return (i = r.call(this, t) || this), (i.type = Xx.COMBINATOR), i;
      }
      return e;
    })(Jx.default);
    Br.default = e1;
    Gc.exports = Br.default;
  });
  var ua = v(($r, Hc) => {
    l();
    ('use strict');
    $r.__esModule = !0;
    $r.default = void 0;
    var t1 = i1(Ve()),
      r1 = ae();
    function i1(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function n1(r, e) {
      (r.prototype = Object.create(e.prototype)),
        (r.prototype.constructor = r),
        la(r, e);
    }
    function la(r, e) {
      return (
        (la = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (i, n) {
              return (i.__proto__ = n), i;
            }),
        la(r, e)
      );
    }
    var s1 = (function (r) {
      n1(e, r);
      function e(t) {
        var i;
        return (
          (i = r.call(this, t) || this),
          (i.type = r1.NESTING),
          (i.value = '&'),
          i
        );
      }
      return e;
    })(t1.default);
    $r.default = s1;
    Hc.exports = $r.default;
  });
  var Qc = v((Ki, Yc) => {
    l();
    ('use strict');
    Ki.__esModule = !0;
    Ki.default = a1;
    function a1(r) {
      return r.sort(function (e, t) {
        return e - t;
      });
    }
    Yc.exports = Ki.default;
  });
  var fa = v((D) => {
    l();
    ('use strict');
    D.__esModule = !0;
    D.word =
      D.tilde =
      D.tab =
      D.str =
      D.space =
      D.slash =
      D.singleQuote =
      D.semicolon =
      D.plus =
      D.pipe =
      D.openSquare =
      D.openParenthesis =
      D.newline =
      D.greaterThan =
      D.feed =
      D.equals =
      D.doubleQuote =
      D.dollar =
      D.cr =
      D.comment =
      D.comma =
      D.combinator =
      D.colon =
      D.closeSquare =
      D.closeParenthesis =
      D.caret =
      D.bang =
      D.backslash =
      D.at =
      D.asterisk =
      D.ampersand =
        void 0;
    var o1 = 38;
    D.ampersand = o1;
    var l1 = 42;
    D.asterisk = l1;
    var u1 = 64;
    D.at = u1;
    var f1 = 44;
    D.comma = f1;
    var c1 = 58;
    D.colon = c1;
    var p1 = 59;
    D.semicolon = p1;
    var d1 = 40;
    D.openParenthesis = d1;
    var h1 = 41;
    D.closeParenthesis = h1;
    var m1 = 91;
    D.openSquare = m1;
    var g1 = 93;
    D.closeSquare = g1;
    var y1 = 36;
    D.dollar = y1;
    var b1 = 126;
    D.tilde = b1;
    var w1 = 94;
    D.caret = w1;
    var v1 = 43;
    D.plus = v1;
    var x1 = 61;
    D.equals = x1;
    var k1 = 124;
    D.pipe = k1;
    var S1 = 62;
    D.greaterThan = S1;
    var _1 = 32;
    D.space = _1;
    var Jc = 39;
    D.singleQuote = Jc;
    var C1 = 34;
    D.doubleQuote = C1;
    var A1 = 47;
    D.slash = A1;
    var O1 = 33;
    D.bang = O1;
    var E1 = 92;
    D.backslash = E1;
    var T1 = 13;
    D.cr = T1;
    var P1 = 12;
    D.feed = P1;
    var D1 = 10;
    D.newline = D1;
    var I1 = 9;
    D.tab = I1;
    var q1 = Jc;
    D.str = q1;
    var R1 = -1;
    D.comment = R1;
    var M1 = -2;
    D.word = M1;
    var F1 = -3;
    D.combinator = F1;
  });
  var Zc = v((jr) => {
    l();
    ('use strict');
    jr.__esModule = !0;
    jr.FIELDS = void 0;
    jr.default = V1;
    var O = N1(fa()),
      Et,
      z;
    function Xc(r) {
      if (typeof WeakMap != 'function') return null;
      var e = new WeakMap(),
        t = new WeakMap();
      return (Xc = function (n) {
        return n ? t : e;
      })(r);
    }
    function N1(r, e) {
      if (!e && r && r.__esModule) return r;
      if (r === null || (typeof r != 'object' && typeof r != 'function'))
        return { default: r };
      var t = Xc(e);
      if (t && t.has(r)) return t.get(r);
      var i = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var s in r)
        if (s !== 'default' && Object.prototype.hasOwnProperty.call(r, s)) {
          var a = n ? Object.getOwnPropertyDescriptor(r, s) : null;
          a && (a.get || a.set)
            ? Object.defineProperty(i, s, a)
            : (i[s] = r[s]);
        }
      return (i.default = r), t && t.set(r, i), i;
    }
    var L1 =
        ((Et = {}),
        (Et[O.tab] = !0),
        (Et[O.newline] = !0),
        (Et[O.cr] = !0),
        (Et[O.feed] = !0),
        Et),
      B1 =
        ((z = {}),
        (z[O.space] = !0),
        (z[O.tab] = !0),
        (z[O.newline] = !0),
        (z[O.cr] = !0),
        (z[O.feed] = !0),
        (z[O.ampersand] = !0),
        (z[O.asterisk] = !0),
        (z[O.bang] = !0),
        (z[O.comma] = !0),
        (z[O.colon] = !0),
        (z[O.semicolon] = !0),
        (z[O.openParenthesis] = !0),
        (z[O.closeParenthesis] = !0),
        (z[O.openSquare] = !0),
        (z[O.closeSquare] = !0),
        (z[O.singleQuote] = !0),
        (z[O.doubleQuote] = !0),
        (z[O.plus] = !0),
        (z[O.pipe] = !0),
        (z[O.tilde] = !0),
        (z[O.greaterThan] = !0),
        (z[O.equals] = !0),
        (z[O.dollar] = !0),
        (z[O.caret] = !0),
        (z[O.slash] = !0),
        z),
      ca = {},
      Kc = '0123456789abcdefABCDEF';
    for (Zi = 0; Zi < Kc.length; Zi++) ca[Kc.charCodeAt(Zi)] = !0;
    var Zi;
    function $1(r, e) {
      var t = e,
        i;
      do {
        if (((i = r.charCodeAt(t)), B1[i])) return t - 1;
        i === O.backslash ? (t = j1(r, t) + 1) : t++;
      } while (t < r.length);
      return t - 1;
    }
    function j1(r, e) {
      var t = e,
        i = r.charCodeAt(t + 1);
      if (!L1[i])
        if (ca[i]) {
          var n = 0;
          do t++, n++, (i = r.charCodeAt(t + 1));
          while (ca[i] && n < 6);
          n < 6 && i === O.space && t++;
        } else t++;
      return t;
    }
    var z1 = {
      TYPE: 0,
      START_LINE: 1,
      START_COL: 2,
      END_LINE: 3,
      END_COL: 4,
      START_POS: 5,
      END_POS: 6,
    };
    jr.FIELDS = z1;
    function V1(r) {
      var e = [],
        t = r.css.valueOf(),
        i = t,
        n = i.length,
        s = -1,
        a = 1,
        o = 0,
        u = 0,
        c,
        f,
        p,
        d,
        h,
        y,
        x,
        b,
        w,
        k,
        S,
        _,
        P;
      function M(F, I) {
        if (r.safe) (t += I), (w = t.length - 1);
        else throw r.error('Unclosed ' + F, a, o - s, o);
      }
      for (; o < n; ) {
        switch (
          ((c = t.charCodeAt(o)), c === O.newline && ((s = o), (a += 1)), c)
        ) {
          case O.space:
          case O.tab:
          case O.newline:
          case O.cr:
          case O.feed:
            w = o;
            do
              (w += 1),
                (c = t.charCodeAt(w)),
                c === O.newline && ((s = w), (a += 1));
            while (
              c === O.space ||
              c === O.newline ||
              c === O.tab ||
              c === O.cr ||
              c === O.feed
            );
            (P = O.space), (d = a), (p = w - s - 1), (u = w);
            break;
          case O.plus:
          case O.greaterThan:
          case O.tilde:
          case O.pipe:
            w = o;
            do (w += 1), (c = t.charCodeAt(w));
            while (
              c === O.plus ||
              c === O.greaterThan ||
              c === O.tilde ||
              c === O.pipe
            );
            (P = O.combinator), (d = a), (p = o - s), (u = w);
            break;
          case O.asterisk:
          case O.ampersand:
          case O.bang:
          case O.comma:
          case O.equals:
          case O.dollar:
          case O.caret:
          case O.openSquare:
          case O.closeSquare:
          case O.colon:
          case O.semicolon:
          case O.openParenthesis:
          case O.closeParenthesis:
            (w = o), (P = c), (d = a), (p = o - s), (u = w + 1);
            break;
          case O.singleQuote:
          case O.doubleQuote:
            (_ = c === O.singleQuote ? "'" : '"'), (w = o);
            do
              for (
                h = !1,
                  w = t.indexOf(_, w + 1),
                  w === -1 && M('quote', _),
                  y = w;
                t.charCodeAt(y - 1) === O.backslash;

              )
                (y -= 1), (h = !h);
            while (h);
            (P = O.str), (d = a), (p = o - s), (u = w + 1);
            break;
          default:
            c === O.slash && t.charCodeAt(o + 1) === O.asterisk
              ? ((w = t.indexOf('*/', o + 2) + 1),
                w === 0 && M('comment', '*/'),
                (f = t.slice(o, w + 1)),
                (b = f.split(`
`)),
                (x = b.length - 1),
                x > 0
                  ? ((k = a + x), (S = w - b[x].length))
                  : ((k = a), (S = s)),
                (P = O.comment),
                (a = k),
                (d = k),
                (p = w - S))
              : c === O.slash
              ? ((w = o), (P = c), (d = a), (p = o - s), (u = w + 1))
              : ((w = $1(t, o)), (P = O.word), (d = a), (p = w - s)),
              (u = w + 1);
            break;
        }
        e.push([P, a, o - s, d, p, o, u]), S && ((s = S), (S = null)), (o = u);
      }
      return e;
    }
  });
  var op = v((zr, ap) => {
    l();
    ('use strict');
    zr.__esModule = !0;
    zr.default = void 0;
    var U1 = be(Ms()),
      pa = be(Ns()),
      W1 = be($s()),
      ep = be(zs()),
      G1 = be(Us()),
      H1 = be(Hs()),
      da = be(Qs()),
      Y1 = be(Xs()),
      tp = en(ia()),
      Q1 = be(sa()),
      ha = be(oa()),
      J1 = be(ua()),
      X1 = be(Qc()),
      A = en(Zc()),
      E = en(fa()),
      K1 = en(ae()),
      H = Sr(),
      mt,
      ma;
    function rp(r) {
      if (typeof WeakMap != 'function') return null;
      var e = new WeakMap(),
        t = new WeakMap();
      return (rp = function (n) {
        return n ? t : e;
      })(r);
    }
    function en(r, e) {
      if (!e && r && r.__esModule) return r;
      if (r === null || (typeof r != 'object' && typeof r != 'function'))
        return { default: r };
      var t = rp(e);
      if (t && t.has(r)) return t.get(r);
      var i = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var s in r)
        if (s !== 'default' && Object.prototype.hasOwnProperty.call(r, s)) {
          var a = n ? Object.getOwnPropertyDescriptor(r, s) : null;
          a && (a.get || a.set)
            ? Object.defineProperty(i, s, a)
            : (i[s] = r[s]);
        }
      return (i.default = r), t && t.set(r, i), i;
    }
    function be(r) {
      return r && r.__esModule ? r : { default: r };
    }
    function ip(r, e) {
      for (var t = 0; t < e.length; t++) {
        var i = e[t];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          'value' in i && (i.writable = !0),
          Object.defineProperty(r, i.key, i);
      }
    }
    function Z1(r, e, t) {
      return (
        e && ip(r.prototype, e),
        t && ip(r, t),
        Object.defineProperty(r, 'prototype', { writable: !1 }),
        r
      );
    }
    var ga =
        ((mt = {}),
        (mt[E.space] = !0),
        (mt[E.cr] = !0),
        (mt[E.feed] = !0),
        (mt[E.newline] = !0),
        (mt[E.tab] = !0),
        mt),
      ek = Object.assign({}, ga, ((ma = {}), (ma[E.comment] = !0), ma));
    function np(r) {
      return { line: r[A.FIELDS.START_LINE], column: r[A.FIELDS.START_COL] };
    }
    function sp(r) {
      return { line: r[A.FIELDS.END_LINE], column: r[A.FIELDS.END_COL] };
    }
    function gt(r, e, t, i) {
      return { start: { line: r, column: e }, end: { line: t, column: i } };
    }
    function Tt(r) {
      return gt(
        r[A.FIELDS.START_LINE],
        r[A.FIELDS.START_COL],
        r[A.FIELDS.END_LINE],
        r[A.FIELDS.END_COL]
      );
    }
    function ya(r, e) {
      if (!!r)
        return gt(
          r[A.FIELDS.START_LINE],
          r[A.FIELDS.START_COL],
          e[A.FIELDS.END_LINE],
          e[A.FIELDS.END_COL]
        );
    }
    function Pt(r, e) {
      var t = r[e];
      if (typeof t == 'string')
        return (
          t.indexOf('\\') !== -1 &&
            ((0, H.ensureObject)(r, 'raws'),
            (r[e] = (0, H.unesc)(t)),
            r.raws[e] === void 0 && (r.raws[e] = t)),
          r
        );
    }
    function ba(r, e) {
      for (var t = -1, i = []; (t = r.indexOf(e, t + 1)) !== -1; ) i.push(t);
      return i;
    }
    function tk() {
      var r = Array.prototype.concat.apply([], arguments);
      return r.filter(function (e, t) {
        return t === r.indexOf(e);
      });
    }
    var rk = (function () {
      function r(t, i) {
        i === void 0 && (i = {}),
          (this.rule = t),
          (this.options = Object.assign({ lossy: !1, safe: !1 }, i)),
          (this.position = 0),
          (this.css =
            typeof this.rule == 'string' ? this.rule : this.rule.selector),
          (this.tokens = (0, A.default)({
            css: this.css,
            error: this._errorGenerator(),
            safe: this.options.safe,
          }));
        var n = ya(this.tokens[0], this.tokens[this.tokens.length - 1]);
        (this.root = new U1.default({ source: n })),
          (this.root.errorGenerator = this._errorGenerator());
        var s = new pa.default({ source: { start: { line: 1, column: 1 } } });
        this.root.append(s), (this.current = s), this.loop();
      }
      var e = r.prototype;
      return (
        (e._errorGenerator = function () {
          var i = this;
          return function (n, s) {
            return typeof i.rule == 'string'
              ? new Error(n)
              : i.rule.error(n, s);
          };
        }),
        (e.attribute = function () {
          var i = [],
            n = this.currToken;
          for (
            this.position++;
            this.position < this.tokens.length &&
            this.currToken[A.FIELDS.TYPE] !== E.closeSquare;

          )
            i.push(this.currToken), this.position++;
          if (this.currToken[A.FIELDS.TYPE] !== E.closeSquare)
            return this.expected(
              'closing square bracket',
              this.currToken[A.FIELDS.START_POS]
            );
          var s = i.length,
            a = {
              source: gt(n[1], n[2], this.currToken[3], this.currToken[4]),
              sourceIndex: n[A.FIELDS.START_POS],
            };
          if (s === 1 && !~[E.word].indexOf(i[0][A.FIELDS.TYPE]))
            return this.expected('attribute', i[0][A.FIELDS.START_POS]);
          for (var o = 0, u = '', c = '', f = null, p = !1; o < s; ) {
            var d = i[o],
              h = this.content(d),
              y = i[o + 1];
            switch (d[A.FIELDS.TYPE]) {
              case E.space:
                if (((p = !0), this.options.lossy)) break;
                if (f) {
                  (0, H.ensureObject)(a, 'spaces', f);
                  var x = a.spaces[f].after || '';
                  a.spaces[f].after = x + h;
                  var b =
                    (0, H.getProp)(a, 'raws', 'spaces', f, 'after') || null;
                  b && (a.raws.spaces[f].after = b + h);
                } else (u = u + h), (c = c + h);
                break;
              case E.asterisk:
                if (y[A.FIELDS.TYPE] === E.equals)
                  (a.operator = h), (f = 'operator');
                else if ((!a.namespace || (f === 'namespace' && !p)) && y) {
                  u &&
                    ((0, H.ensureObject)(a, 'spaces', 'attribute'),
                    (a.spaces.attribute.before = u),
                    (u = '')),
                    c &&
                      ((0, H.ensureObject)(a, 'raws', 'spaces', 'attribute'),
                      (a.raws.spaces.attribute.before = u),
                      (c = '')),
                    (a.namespace = (a.namespace || '') + h);
                  var w = (0, H.getProp)(a, 'raws', 'namespace') || null;
                  w && (a.raws.namespace += h), (f = 'namespace');
                }
                p = !1;
                break;
              case E.dollar:
                if (f === 'value') {
                  var k = (0, H.getProp)(a, 'raws', 'value');
                  (a.value += '$'), k && (a.raws.value = k + '$');
                  break;
                }
              case E.caret:
                y[A.FIELDS.TYPE] === E.equals &&
                  ((a.operator = h), (f = 'operator')),
                  (p = !1);
                break;
              case E.combinator:
                if (
                  (h === '~' &&
                    y[A.FIELDS.TYPE] === E.equals &&
                    ((a.operator = h), (f = 'operator')),
                  h !== '|')
                ) {
                  p = !1;
                  break;
                }
                y[A.FIELDS.TYPE] === E.equals
                  ? ((a.operator = h), (f = 'operator'))
                  : !a.namespace && !a.attribute && (a.namespace = !0),
                  (p = !1);
                break;
              case E.word:
                if (
                  y &&
                  this.content(y) === '|' &&
                  i[o + 2] &&
                  i[o + 2][A.FIELDS.TYPE] !== E.equals &&
                  !a.operator &&
                  !a.namespace
                )
                  (a.namespace = h), (f = 'namespace');
                else if (!a.attribute || (f === 'attribute' && !p)) {
                  u &&
                    ((0, H.ensureObject)(a, 'spaces', 'attribute'),
                    (a.spaces.attribute.before = u),
                    (u = '')),
                    c &&
                      ((0, H.ensureObject)(a, 'raws', 'spaces', 'attribute'),
                      (a.raws.spaces.attribute.before = c),
                      (c = '')),
                    (a.attribute = (a.attribute || '') + h);
                  var S = (0, H.getProp)(a, 'raws', 'attribute') || null;
                  S && (a.raws.attribute += h), (f = 'attribute');
                } else if (
                  (!a.value && a.value !== '') ||
                  (f === 'value' && !(p || a.quoteMark))
                ) {
                  var _ = (0, H.unesc)(h),
                    P = (0, H.getProp)(a, 'raws', 'value') || '',
                    M = a.value || '';
                  (a.value = M + _),
                    (a.quoteMark = null),
                    (_ !== h || P) &&
                      ((0, H.ensureObject)(a, 'raws'),
                      (a.raws.value = (P || M) + h)),
                    (f = 'value');
                } else {
                  var F = h === 'i' || h === 'I';
                  (a.value || a.value === '') && (a.quoteMark || p)
                    ? ((a.insensitive = F),
                      (!F || h === 'I') &&
                        ((0, H.ensureObject)(a, 'raws'),
                        (a.raws.insensitiveFlag = h)),
                      (f = 'insensitive'),
                      u &&
                        ((0, H.ensureObject)(a, 'spaces', 'insensitive'),
                        (a.spaces.insensitive.before = u),
                        (u = '')),
                      c &&
                        ((0, H.ensureObject)(
                          a,
                          'raws',
                          'spaces',
                          'insensitive'
                        ),
                        (a.raws.spaces.insensitive.before = c),
                        (c = '')))
                    : (a.value || a.value === '') &&
                      ((f = 'value'),
                      (a.value += h),
                      a.raws.value && (a.raws.value += h));
                }
                p = !1;
                break;
              case E.str:
                if (!a.attribute || !a.operator)
                  return this.error(
                    'Expected an attribute followed by an operator preceding the string.',
                    { index: d[A.FIELDS.START_POS] }
                  );
                var I = (0, tp.unescapeValue)(h),
                  X = I.unescaped,
                  ge = I.quoteMark;
                (a.value = X),
                  (a.quoteMark = ge),
                  (f = 'value'),
                  (0, H.ensureObject)(a, 'raws'),
                  (a.raws.value = h),
                  (p = !1);
                break;
              case E.equals:
                if (!a.attribute)
                  return this.expected('attribute', d[A.FIELDS.START_POS], h);
                if (a.value)
                  return this.error(
                    'Unexpected "=" found; an operator was already defined.',
                    { index: d[A.FIELDS.START_POS] }
                  );
                (a.operator = a.operator ? a.operator + h : h),
                  (f = 'operator'),
                  (p = !1);
                break;
              case E.comment:
                if (f)
                  if (
                    p ||
                    (y && y[A.FIELDS.TYPE] === E.space) ||
                    f === 'insensitive'
                  ) {
                    var Q = (0, H.getProp)(a, 'spaces', f, 'after') || '',
                      Z = (0, H.getProp)(a, 'raws', 'spaces', f, 'after') || Q;
                    (0, H.ensureObject)(a, 'raws', 'spaces', f),
                      (a.raws.spaces[f].after = Z + h);
                  } else {
                    var ee = a[f] || '',
                      wt = (0, H.getProp)(a, 'raws', f) || ee;
                    (0, H.ensureObject)(a, 'raws'), (a.raws[f] = wt + h);
                  }
                else c = c + h;
                break;
              default:
                return this.error('Unexpected "' + h + '" found.', {
                  index: d[A.FIELDS.START_POS],
                });
            }
            o++;
          }
          Pt(a, 'attribute'),
            Pt(a, 'namespace'),
            this.newNode(new tp.default(a)),
            this.position++;
        }),
        (e.parseWhitespaceEquivalentTokens = function (i) {
          i < 0 && (i = this.tokens.length);
          var n = this.position,
            s = [],
            a = '',
            o = void 0;
          do
            if (ga[this.currToken[A.FIELDS.TYPE]])
              this.options.lossy || (a += this.content());
            else if (this.currToken[A.FIELDS.TYPE] === E.comment) {
              var u = {};
              a && ((u.before = a), (a = '')),
                (o = new ep.default({
                  value: this.content(),
                  source: Tt(this.currToken),
                  sourceIndex: this.currToken[A.FIELDS.START_POS],
                  spaces: u,
                })),
                s.push(o);
            }
          while (++this.position < i);
          if (a) {
            if (o) o.spaces.after = a;
            else if (!this.options.lossy) {
              var c = this.tokens[n],
                f = this.tokens[this.position - 1];
              s.push(
                new da.default({
                  value: '',
                  source: gt(
                    c[A.FIELDS.START_LINE],
                    c[A.FIELDS.START_COL],
                    f[A.FIELDS.END_LINE],
                    f[A.FIELDS.END_COL]
                  ),
                  sourceIndex: c[A.FIELDS.START_POS],
                  spaces: { before: a, after: '' },
                })
              );
            }
          }
          return s;
        }),
        (e.convertWhitespaceNodesToSpace = function (i, n) {
          var s = this;
          n === void 0 && (n = !1);
          var a = '',
            o = '';
          i.forEach(function (c) {
            var f = s.lossySpace(c.spaces.before, n),
              p = s.lossySpace(c.rawSpaceBefore, n);
            (a += f + s.lossySpace(c.spaces.after, n && f.length === 0)),
              (o +=
                f +
                c.value +
                s.lossySpace(c.rawSpaceAfter, n && p.length === 0));
          }),
            o === a && (o = void 0);
          var u = { space: a, rawSpace: o };
          return u;
        }),
        (e.isNamedCombinator = function (i) {
          return (
            i === void 0 && (i = this.position),
            this.tokens[i + 0] &&
              this.tokens[i + 0][A.FIELDS.TYPE] === E.slash &&
              this.tokens[i + 1] &&
              this.tokens[i + 1][A.FIELDS.TYPE] === E.word &&
              this.tokens[i + 2] &&
              this.tokens[i + 2][A.FIELDS.TYPE] === E.slash
          );
        }),
        (e.namedCombinator = function () {
          if (this.isNamedCombinator()) {
            var i = this.content(this.tokens[this.position + 1]),
              n = (0, H.unesc)(i).toLowerCase(),
              s = {};
            n !== i && (s.value = '/' + i + '/');
            var a = new ha.default({
              value: '/' + n + '/',
              source: gt(
                this.currToken[A.FIELDS.START_LINE],
                this.currToken[A.FIELDS.START_COL],
                this.tokens[this.position + 2][A.FIELDS.END_LINE],
                this.tokens[this.position + 2][A.FIELDS.END_COL]
              ),
              sourceIndex: this.currToken[A.FIELDS.START_POS],
              raws: s,
            });
            return (this.position = this.position + 3), a;
          } else this.unexpected();
        }),
        (e.combinator = function () {
          var i = this;
          if (this.content() === '|') return this.namespace();
          var n = this.locateNextMeaningfulToken(this.position);
          if (n < 0 || this.tokens[n][A.FIELDS.TYPE] === E.comma) {
            var s = this.parseWhitespaceEquivalentTokens(n);
            if (s.length > 0) {
              var a = this.current.last;
              if (a) {
                var o = this.convertWhitespaceNodesToSpace(s),
                  u = o.space,
                  c = o.rawSpace;
                c !== void 0 && (a.rawSpaceAfter += c), (a.spaces.after += u);
              } else
                s.forEach(function (P) {
                  return i.newNode(P);
                });
            }
            return;
          }
          var f = this.currToken,
            p = void 0;
          n > this.position && (p = this.parseWhitespaceEquivalentTokens(n));
          var d;
          if (
            (this.isNamedCombinator()
              ? (d = this.namedCombinator())
              : this.currToken[A.FIELDS.TYPE] === E.combinator
              ? ((d = new ha.default({
                  value: this.content(),
                  source: Tt(this.currToken),
                  sourceIndex: this.currToken[A.FIELDS.START_POS],
                })),
                this.position++)
              : ga[this.currToken[A.FIELDS.TYPE]] || p || this.unexpected(),
            d)
          ) {
            if (p) {
              var h = this.convertWhitespaceNodesToSpace(p),
                y = h.space,
                x = h.rawSpace;
              (d.spaces.before = y), (d.rawSpaceBefore = x);
            }
          } else {
            var b = this.convertWhitespaceNodesToSpace(p, !0),
              w = b.space,
              k = b.rawSpace;
            k || (k = w);
            var S = {},
              _ = { spaces: {} };
            w.endsWith(' ') && k.endsWith(' ')
              ? ((S.before = w.slice(0, w.length - 1)),
                (_.spaces.before = k.slice(0, k.length - 1)))
              : w.startsWith(' ') && k.startsWith(' ')
              ? ((S.after = w.slice(1)), (_.spaces.after = k.slice(1)))
              : (_.value = k),
              (d = new ha.default({
                value: ' ',
                source: ya(f, this.tokens[this.position - 1]),
                sourceIndex: f[A.FIELDS.START_POS],
                spaces: S,
                raws: _,
              }));
          }
          return (
            this.currToken &&
              this.currToken[A.FIELDS.TYPE] === E.space &&
              ((d.spaces.after = this.optionalSpace(this.content())),
              this.position++),
            this.newNode(d)
          );
        }),
        (e.comma = function () {
          if (this.position === this.tokens.length - 1) {
            (this.root.trailingComma = !0), this.position++;
            return;
          }
          this.current._inferEndPosition();
          var i = new pa.default({
            source: { start: np(this.tokens[this.position + 1]) },
          });
          this.current.parent.append(i), (this.current = i), this.position++;
        }),
        (e.comment = function () {
          var i = this.currToken;
          this.newNode(
            new ep.default({
              value: this.content(),
              source: Tt(i),
              sourceIndex: i[A.FIELDS.START_POS],
            })
          ),
            this.position++;
        }),
        (e.error = function (i, n) {
          throw this.root.error(i, n);
        }),
        (e.missingBackslash = function () {
          return this.error('Expected a backslash preceding the semicolon.', {
            index: this.currToken[A.FIELDS.START_POS],
          });
        }),
        (e.missingParenthesis = function () {
          return this.expected(
            'opening parenthesis',
            this.currToken[A.FIELDS.START_POS]
          );
        }),
        (e.missingSquareBracket = function () {
          return this.expected(
            'opening square bracket',
            this.currToken[A.FIELDS.START_POS]
          );
        }),
        (e.unexpected = function () {
          return this.error(
            "Unexpected '" +
              this.content() +
              "'. Escaping special characters with \\ may help.",
            this.currToken[A.FIELDS.START_POS]
          );
        }),
        (e.unexpectedPipe = function () {
          return this.error(
            "Unexpected '|'.",
            this.currToken[A.FIELDS.START_POS]
          );
        }),
        (e.namespace = function () {
          var i = (this.prevToken && this.content(this.prevToken)) || !0;
          if (this.nextToken[A.FIELDS.TYPE] === E.word)
            return this.position++, this.word(i);
          if (this.nextToken[A.FIELDS.TYPE] === E.asterisk)
            return this.position++, this.universal(i);
          this.unexpectedPipe();
        }),
        (e.nesting = function () {
          if (this.nextToken) {
            var i = this.content(this.nextToken);
            if (i === '|') {
              this.position++;
              return;
            }
          }
          var n = this.currToken;
          this.newNode(
            new J1.default({
              value: this.content(),
              source: Tt(n),
              sourceIndex: n[A.FIELDS.START_POS],
            })
          ),
            this.position++;
        }),
        (e.parentheses = function () {
          var i = this.current.last,
            n = 1;
          if ((this.position++, i && i.type === K1.PSEUDO)) {
            var s = new pa.default({
                source: { start: np(this.tokens[this.position - 1]) },
              }),
              a = this.current;
            for (
              i.append(s), this.current = s;
              this.position < this.tokens.length && n;

            )
              this.currToken[A.FIELDS.TYPE] === E.openParenthesis && n++,
                this.currToken[A.FIELDS.TYPE] === E.closeParenthesis && n--,
                n
                  ? this.parse()
                  : ((this.current.source.end = sp(this.currToken)),
                    (this.current.parent.source.end = sp(this.currToken)),
                    this.position++);
            this.current = a;
          } else {
            for (
              var o = this.currToken, u = '(', c;
              this.position < this.tokens.length && n;

            )
              this.currToken[A.FIELDS.TYPE] === E.openParenthesis && n++,
                this.currToken[A.FIELDS.TYPE] === E.closeParenthesis && n--,
                (c = this.currToken),
                (u += this.parseParenthesisToken(this.currToken)),
                this.position++;
            i
              ? i.appendToPropertyAndEscape('value', u, u)
              : this.newNode(
                  new da.default({
                    value: u,
                    source: gt(
                      o[A.FIELDS.START_LINE],
                      o[A.FIELDS.START_COL],
                      c[A.FIELDS.END_LINE],
                      c[A.FIELDS.END_COL]
                    ),
                    sourceIndex: o[A.FIELDS.START_POS],
                  })
                );
          }
          if (n)
            return this.expected(
              'closing parenthesis',
              this.currToken[A.FIELDS.START_POS]
            );
        }),
        (e.pseudo = function () {
          for (
            var i = this, n = '', s = this.currToken;
            this.currToken && this.currToken[A.FIELDS.TYPE] === E.colon;

          )
            (n += this.content()), this.position++;
          if (!this.currToken)
            return this.expected(
              ['pseudo-class', 'pseudo-element'],
              this.position - 1
            );
          if (this.currToken[A.FIELDS.TYPE] === E.word)
            this.splitWord(!1, function (a, o) {
              (n += a),
                i.newNode(
                  new Y1.default({
                    value: n,
                    source: ya(s, i.currToken),
                    sourceIndex: s[A.FIELDS.START_POS],
                  })
                ),
                o > 1 &&
                  i.nextToken &&
                  i.nextToken[A.FIELDS.TYPE] === E.openParenthesis &&
                  i.error('Misplaced parenthesis.', {
                    index: i.nextToken[A.FIELDS.START_POS],
                  });
            });
          else
            return this.expected(
              ['pseudo-class', 'pseudo-element'],
              this.currToken[A.FIELDS.START_POS]
            );
        }),
        (e.space = function () {
          var i = this.content();
          this.position === 0 ||
          this.prevToken[A.FIELDS.TYPE] === E.comma ||
          this.prevToken[A.FIELDS.TYPE] === E.openParenthesis ||
          this.current.nodes.every(function (n) {
            return n.type === 'comment';
          })
            ? ((this.spaces = this.optionalSpace(i)), this.position++)
            : this.position === this.tokens.length - 1 ||
              this.nextToken[A.FIELDS.TYPE] === E.comma ||
              this.nextToken[A.FIELDS.TYPE] === E.closeParenthesis
            ? ((this.current.last.spaces.after = this.optionalSpace(i)),
              this.position++)
            : this.combinator();
        }),
        (e.string = function () {
          var i = this.currToken;
          this.newNode(
            new da.default({
              value: this.content(),
              source: Tt(i),
              sourceIndex: i[A.FIELDS.START_POS],
            })
          ),
            this.position++;
        }),
        (e.universal = function (i) {
          var n = this.nextToken;
          if (n && this.content(n) === '|')
            return this.position++, this.namespace();
          var s = this.currToken;
          this.newNode(
            new Q1.default({
              value: this.content(),
              source: Tt(s),
              sourceIndex: s[A.FIELDS.START_POS],
            }),
            i
          ),
            this.position++;
        }),
        (e.splitWord = function (i, n) {
          for (
            var s = this, a = this.nextToken, o = this.content();
            a &&
            ~[E.dollar, E.caret, E.equals, E.word].indexOf(a[A.FIELDS.TYPE]);

          ) {
            this.position++;
            var u = this.content();
            if (((o += u), u.lastIndexOf('\\') === u.length - 1)) {
              var c = this.nextToken;
              c &&
                c[A.FIELDS.TYPE] === E.space &&
                ((o += this.requiredSpace(this.content(c))), this.position++);
            }
            a = this.nextToken;
          }
          var f = ba(o, '.').filter(function (y) {
              var x = o[y - 1] === '\\',
                b = /^\d+\.\d+%$/.test(o);
              return !x && !b;
            }),
            p = ba(o, '#').filter(function (y) {
              return o[y - 1] !== '\\';
            }),
            d = ba(o, '#{');
          d.length &&
            (p = p.filter(function (y) {
              return !~d.indexOf(y);
            }));
          var h = (0, X1.default)(tk([0].concat(f, p)));
          h.forEach(function (y, x) {
            var b = h[x + 1] || o.length,
              w = o.slice(y, b);
            if (x === 0 && n) return n.call(s, w, h.length);
            var k,
              S = s.currToken,
              _ = S[A.FIELDS.START_POS] + h[x],
              P = gt(S[1], S[2] + y, S[3], S[2] + (b - 1));
            if (~f.indexOf(y)) {
              var M = { value: w.slice(1), source: P, sourceIndex: _ };
              k = new W1.default(Pt(M, 'value'));
            } else if (~p.indexOf(y)) {
              var F = { value: w.slice(1), source: P, sourceIndex: _ };
              k = new G1.default(Pt(F, 'value'));
            } else {
              var I = { value: w, source: P, sourceIndex: _ };
              Pt(I, 'value'), (k = new H1.default(I));
            }
            s.newNode(k, i), (i = null);
          }),
            this.position++;
        }),
        (e.word = function (i) {
          var n = this.nextToken;
          return n && this.content(n) === '|'
            ? (this.position++, this.namespace())
            : this.splitWord(i);
        }),
        (e.loop = function () {
          for (; this.position < this.tokens.length; ) this.parse(!0);
          return this.current._inferEndPosition(), this.root;
        }),
        (e.parse = function (i) {
          switch (this.currToken[A.FIELDS.TYPE]) {
            case E.space:
              this.space();
              break;
            case E.comment:
              this.comment();
              break;
            case E.openParenthesis:
              this.parentheses();
              break;
            case E.closeParenthesis:
              i && this.missingParenthesis();
              break;
            case E.openSquare:
              this.attribute();
              break;
            case E.dollar:
            case E.caret:
            case E.equals:
            case E.word:
              this.word();
              break;
            case E.colon:
              this.pseudo();
              break;
            case E.comma:
              this.comma();
              break;
            case E.asterisk:
              this.universal();
              break;
            case E.ampersand:
              this.nesting();
              break;
            case E.slash:
            case E.combinator:
              this.combinator();
              break;
            case E.str:
              this.string();
              break;
            case E.closeSquare:
              this.missingSquareBracket();
            case E.semicolon:
              this.missingBackslash();
            default:
              this.unexpected();
          }
        }),
        (e.expected = function (i, n, s) {
          if (Array.isArray(i)) {
            var a = i.pop();
            i = i.join(', ') + ' or ' + a;
          }
          var o = /^[aeiou]/.test(i[0]) ? 'an' : 'a';
          return s
            ? this.error(
                'Expected ' + o + ' ' + i + ', found "' + s + '" instead.',
                { index: n }
              )
            : this.error('Expected ' + o + ' ' + i + '.', { index: n });
        }),
        (e.requiredSpace = function (i) {
          return this.options.lossy ? ' ' : i;
        }),
        (e.optionalSpace = function (i) {
          return this.options.lossy ? '' : i;
        }),
        (e.lossySpace = function (i, n) {
          return this.options.lossy ? (n ? ' ' : '') : i;
        }),
        (e.parseParenthesisToken = function (i) {
          var n = this.content(i);
          return i[A.FIELDS.TYPE] === E.space ? this.requiredSpace(n) : n;
        }),
        (e.newNode = function (i, n) {
          return (
            n &&
              (/^ +$/.test(n) &&
                (this.options.lossy || (this.spaces = (this.spaces || '') + n),
                (n = !0)),
              (i.namespace = n),
              Pt(i, 'namespace')),
            this.spaces &&
              ((i.spaces.before = this.spaces), (this.spaces = '')),
            this.current.append(i)
          );
        }),
        (e.content = function (i) {
          return (
            i === void 0 && (i = this.currToken),
            this.css.slice(i[A.FIELDS.START_POS], i[A.FIELDS.END_POS])
          );
        }),
        (e.locateNextMeaningfulToken = function (i) {
          i === void 0 && (i = this.position + 1);
          for (var n = i; n < this.tokens.length; )
            if (ek[this.tokens[n][A.FIELDS.TYPE]]) {
              n++;
              continue;
            } else return n;
          return -1;
        }),
        Z1(r, [
          {
            key: 'currToken',
            get: function () {
              return this.tokens[this.position];
            },
          },
          {
            key: 'nextToken',
            get: function () {
              return this.tokens[this.position + 1];
            },
          },
          {
            key: 'prevToken',
            get: function () {
              return this.tokens[this.position - 1];
            },
          },
        ]),
        r
      );
    })();
    zr.default = rk;
    ap.exports = zr.default;
  });
  var up = v((Vr, lp) => {
    l();
    ('use strict');
    Vr.__esModule = !0;
    Vr.default = void 0;
    var ik = nk(op());
    function nk(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var sk = (function () {
      function r(t, i) {
        (this.func = t || function () {}),
          (this.funcRes = null),
          (this.options = i);
      }
      var e = r.prototype;
      return (
        (e._shouldUpdateSelector = function (i, n) {
          n === void 0 && (n = {});
          var s = Object.assign({}, this.options, n);
          return s.updateSelector === !1 ? !1 : typeof i != 'string';
        }),
        (e._isLossy = function (i) {
          i === void 0 && (i = {});
          var n = Object.assign({}, this.options, i);
          return n.lossless === !1;
        }),
        (e._root = function (i, n) {
          n === void 0 && (n = {});
          var s = new ik.default(i, this._parseOptions(n));
          return s.root;
        }),
        (e._parseOptions = function (i) {
          return { lossy: this._isLossy(i) };
        }),
        (e._run = function (i, n) {
          var s = this;
          return (
            n === void 0 && (n = {}),
            new Promise(function (a, o) {
              try {
                var u = s._root(i, n);
                Promise.resolve(s.func(u))
                  .then(function (c) {
                    var f = void 0;
                    return (
                      s._shouldUpdateSelector(i, n) &&
                        ((f = u.toString()), (i.selector = f)),
                      { transform: c, root: u, string: f }
                    );
                  })
                  .then(a, o);
              } catch (c) {
                o(c);
                return;
              }
            })
          );
        }),
        (e._runSync = function (i, n) {
          n === void 0 && (n = {});
          var s = this._root(i, n),
            a = this.func(s);
          if (a && typeof a.then == 'function')
            throw new Error(
              'Selector processor returned a promise to a synchronous call.'
            );
          var o = void 0;
          return (
            n.updateSelector &&
              typeof i != 'string' &&
              ((o = s.toString()), (i.selector = o)),
            { transform: a, root: s, string: o }
          );
        }),
        (e.ast = function (i, n) {
          return this._run(i, n).then(function (s) {
            return s.root;
          });
        }),
        (e.astSync = function (i, n) {
          return this._runSync(i, n).root;
        }),
        (e.transform = function (i, n) {
          return this._run(i, n).then(function (s) {
            return s.transform;
          });
        }),
        (e.transformSync = function (i, n) {
          return this._runSync(i, n).transform;
        }),
        (e.process = function (i, n) {
          return this._run(i, n).then(function (s) {
            return s.string || s.root.toString();
          });
        }),
        (e.processSync = function (i, n) {
          var s = this._runSync(i, n);
          return s.string || s.root.toString();
        }),
        r
      );
    })();
    Vr.default = sk;
    lp.exports = Vr.default;
  });
  var fp = v((G) => {
    l();
    ('use strict');
    G.__esModule = !0;
    G.universal =
      G.tag =
      G.string =
      G.selector =
      G.root =
      G.pseudo =
      G.nesting =
      G.id =
      G.comment =
      G.combinator =
      G.className =
      G.attribute =
        void 0;
    var ak = we(ia()),
      ok = we($s()),
      lk = we(oa()),
      uk = we(zs()),
      fk = we(Us()),
      ck = we(ua()),
      pk = we(Xs()),
      dk = we(Ms()),
      hk = we(Ns()),
      mk = we(Qs()),
      gk = we(Hs()),
      yk = we(sa());
    function we(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var bk = function (e) {
      return new ak.default(e);
    };
    G.attribute = bk;
    var wk = function (e) {
      return new ok.default(e);
    };
    G.className = wk;
    var vk = function (e) {
      return new lk.default(e);
    };
    G.combinator = vk;
    var xk = function (e) {
      return new uk.default(e);
    };
    G.comment = xk;
    var kk = function (e) {
      return new fk.default(e);
    };
    G.id = kk;
    var Sk = function (e) {
      return new ck.default(e);
    };
    G.nesting = Sk;
    var _k = function (e) {
      return new pk.default(e);
    };
    G.pseudo = _k;
    var Ck = function (e) {
      return new dk.default(e);
    };
    G.root = Ck;
    var Ak = function (e) {
      return new hk.default(e);
    };
    G.selector = Ak;
    var Ok = function (e) {
      return new mk.default(e);
    };
    G.string = Ok;
    var Ek = function (e) {
      return new gk.default(e);
    };
    G.tag = Ek;
    var Tk = function (e) {
      return new yk.default(e);
    };
    G.universal = Tk;
  });
  var hp = v((B) => {
    l();
    ('use strict');
    B.__esModule = !0;
    B.isComment = B.isCombinator = B.isClassName = B.isAttribute = void 0;
    B.isContainer = jk;
    B.isIdentifier = void 0;
    B.isNamespace = zk;
    B.isNesting = void 0;
    B.isNode = wa;
    B.isPseudo = void 0;
    B.isPseudoClass = $k;
    B.isPseudoElement = dp;
    B.isUniversal = B.isTag = B.isString = B.isSelector = B.isRoot = void 0;
    var Y = ae(),
      fe,
      Pk =
        ((fe = {}),
        (fe[Y.ATTRIBUTE] = !0),
        (fe[Y.CLASS] = !0),
        (fe[Y.COMBINATOR] = !0),
        (fe[Y.COMMENT] = !0),
        (fe[Y.ID] = !0),
        (fe[Y.NESTING] = !0),
        (fe[Y.PSEUDO] = !0),
        (fe[Y.ROOT] = !0),
        (fe[Y.SELECTOR] = !0),
        (fe[Y.STRING] = !0),
        (fe[Y.TAG] = !0),
        (fe[Y.UNIVERSAL] = !0),
        fe);
    function wa(r) {
      return typeof r == 'object' && Pk[r.type];
    }
    function ve(r, e) {
      return wa(e) && e.type === r;
    }
    var cp = ve.bind(null, Y.ATTRIBUTE);
    B.isAttribute = cp;
    var Dk = ve.bind(null, Y.CLASS);
    B.isClassName = Dk;
    var Ik = ve.bind(null, Y.COMBINATOR);
    B.isCombinator = Ik;
    var qk = ve.bind(null, Y.COMMENT);
    B.isComment = qk;
    var Rk = ve.bind(null, Y.ID);
    B.isIdentifier = Rk;
    var Mk = ve.bind(null, Y.NESTING);
    B.isNesting = Mk;
    var va = ve.bind(null, Y.PSEUDO);
    B.isPseudo = va;
    var Fk = ve.bind(null, Y.ROOT);
    B.isRoot = Fk;
    var Nk = ve.bind(null, Y.SELECTOR);
    B.isSelector = Nk;
    var Lk = ve.bind(null, Y.STRING);
    B.isString = Lk;
    var pp = ve.bind(null, Y.TAG);
    B.isTag = pp;
    var Bk = ve.bind(null, Y.UNIVERSAL);
    B.isUniversal = Bk;
    function dp(r) {
      return (
        va(r) &&
        r.value &&
        (r.value.startsWith('::') ||
          r.value.toLowerCase() === ':before' ||
          r.value.toLowerCase() === ':after' ||
          r.value.toLowerCase() === ':first-letter' ||
          r.value.toLowerCase() === ':first-line')
      );
    }
    function $k(r) {
      return va(r) && !dp(r);
    }
    function jk(r) {
      return !!(wa(r) && r.walk);
    }
    function zk(r) {
      return cp(r) || pp(r);
    }
  });
  var mp = v((Ee) => {
    l();
    ('use strict');
    Ee.__esModule = !0;
    var xa = ae();
    Object.keys(xa).forEach(function (r) {
      r === 'default' ||
        r === '__esModule' ||
        (r in Ee && Ee[r] === xa[r]) ||
        (Ee[r] = xa[r]);
    });
    var ka = fp();
    Object.keys(ka).forEach(function (r) {
      r === 'default' ||
        r === '__esModule' ||
        (r in Ee && Ee[r] === ka[r]) ||
        (Ee[r] = ka[r]);
    });
    var Sa = hp();
    Object.keys(Sa).forEach(function (r) {
      r === 'default' ||
        r === '__esModule' ||
        (r in Ee && Ee[r] === Sa[r]) ||
        (Ee[r] = Sa[r]);
    });
  });
  var Me = v((Ur, yp) => {
    l();
    ('use strict');
    Ur.__esModule = !0;
    Ur.default = void 0;
    var Vk = Gk(up()),
      Uk = Wk(mp());
    function gp(r) {
      if (typeof WeakMap != 'function') return null;
      var e = new WeakMap(),
        t = new WeakMap();
      return (gp = function (n) {
        return n ? t : e;
      })(r);
    }
    function Wk(r, e) {
      if (!e && r && r.__esModule) return r;
      if (r === null || (typeof r != 'object' && typeof r != 'function'))
        return { default: r };
      var t = gp(e);
      if (t && t.has(r)) return t.get(r);
      var i = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var s in r)
        if (s !== 'default' && Object.prototype.hasOwnProperty.call(r, s)) {
          var a = n ? Object.getOwnPropertyDescriptor(r, s) : null;
          a && (a.get || a.set)
            ? Object.defineProperty(i, s, a)
            : (i[s] = r[s]);
        }
      return (i.default = r), t && t.set(r, i), i;
    }
    function Gk(r) {
      return r && r.__esModule ? r : { default: r };
    }
    var _a = function (e) {
      return new Vk.default(e);
    };
    Object.assign(_a, Uk);
    delete _a.__esModule;
    var Hk = _a;
    Ur.default = Hk;
    yp.exports = Ur.default;
  });
  function We(r) {
    return ['fontSize', 'outline'].includes(r)
      ? (e) => (
          typeof e == 'function' && (e = e({})),
          Array.isArray(e) && (e = e[0]),
          e
        )
      : r === 'fontFamily'
      ? (e) => {
          typeof e == 'function' && (e = e({}));
          let t = Array.isArray(e) && se(e[1]) ? e[0] : e;
          return Array.isArray(t) ? t.join(', ') : t;
        }
      : [
          'boxShadow',
          'transitionProperty',
          'transitionDuration',
          'transitionDelay',
          'transitionTimingFunction',
          'backgroundImage',
          'backgroundSize',
          'backgroundColor',
          'cursor',
          'animation',
        ].includes(r)
      ? (e) => (
          typeof e == 'function' && (e = e({})),
          Array.isArray(e) && (e = e.join(', ')),
          e
        )
      : ['gridTemplateColumns', 'gridTemplateRows', 'objectPosition'].includes(
          r
        )
      ? (e) => (
          typeof e == 'function' && (e = e({})),
          typeof e == 'string' && (e = j.list.comma(e).join(' ')),
          e
        )
      : (e, t = {}) => (typeof e == 'function' && (e = e(t)), e);
  }
  var Wr = C(() => {
    l();
    it();
    vt();
  });
  var _p = v((zT, Ta) => {
    l();
    var { Rule: bp, AtRule: Yk } = me(),
      wp = Me();
    function Ca(r, e) {
      let t;
      try {
        wp((i) => {
          t = i;
        }).processSync(r);
      } catch (i) {
        throw r.includes(':')
          ? e
            ? e.error('Missed semicolon')
            : i
          : e
          ? e.error(i.message)
          : i;
      }
      return t.at(0);
    }
    function vp(r, e) {
      let t = !1;
      return (
        r.each((i) => {
          if (i.type === 'nesting') {
            let n = e.clone({});
            i.value !== '&'
              ? i.replaceWith(Ca(i.value.replace('&', n.toString())))
              : i.replaceWith(n),
              (t = !0);
          } else 'nodes' in i && i.nodes && vp(i, e) && (t = !0);
        }),
        t
      );
    }
    function xp(r, e) {
      let t = [];
      return (
        r.selectors.forEach((i) => {
          let n = Ca(i, r);
          e.selectors.forEach((s) => {
            if (!s) return;
            let a = Ca(s, e);
            vp(a, n) ||
              (a.prepend(wp.combinator({ value: ' ' })),
              a.prepend(n.clone({}))),
              t.push(a.toString());
          });
        }),
        t
      );
    }
    function tn(r, e) {
      let t = r.prev();
      for (e.after(r); t && t.type === 'comment'; ) {
        let i = t.prev();
        e.after(t), (t = i);
      }
      return r;
    }
    function Qk(r) {
      return function e(t, i, n, s = n) {
        let a = [];
        if (
          (i.each((o) => {
            o.type === 'rule' && n
              ? s && (o.selectors = xp(t, o))
              : o.type === 'atrule' && o.nodes
              ? r[o.name]
                ? e(t, o, s)
                : i[Oa] !== !1 && a.push(o)
              : a.push(o);
          }),
          n && a.length)
        ) {
          let o = t.clone({ nodes: [] });
          for (let u of a) o.append(u);
          i.prepend(o);
        }
      };
    }
    function Aa(r, e, t) {
      let i = new bp({ selector: r, nodes: [] });
      return i.append(e), t.after(i), i;
    }
    function kp(r, e) {
      let t = {};
      for (let i of r) t[i] = !0;
      if (e) for (let i of e) t[i.replace(/^@/, '')] = !0;
      return t;
    }
    function Jk(r) {
      r = r.trim();
      let e = r.match(/^\((.*)\)$/);
      if (!e) return { type: 'basic', selector: r };
      let t = e[1].match(/^(with(?:out)?):(.+)$/);
      if (t) {
        let i = t[1] === 'with',
          n = Object.fromEntries(
            t[2]
              .trim()
              .split(/\s+/)
              .map((a) => [a, !0])
          );
        if (i && n.all) return { type: 'noop' };
        let s = (a) => !!n[a];
        return (
          n.all ? (s = () => !0) : i && (s = (a) => (a === 'all' ? !1 : !n[a])),
          { type: 'withrules', escapes: s }
        );
      }
      return { type: 'unknown' };
    }
    function Xk(r) {
      let e = [],
        t = r.parent;
      for (; t && t instanceof Yk; ) e.push(t), (t = t.parent);
      return e;
    }
    function Kk(r) {
      let e = r[Sp];
      if (!e) r.after(r.nodes);
      else {
        let t = r.nodes,
          i,
          n = -1,
          s,
          a,
          o,
          u = Xk(r);
        if (
          (u.forEach((c, f) => {
            if (e(c.name)) (i = c), (n = f), (a = o);
            else {
              let p = o;
              (o = c.clone({ nodes: [] })), p && o.append(p), (s = s || o);
            }
          }),
          i ? (a ? (s.append(t), i.after(a)) : i.after(t)) : r.after(t),
          r.next() && i)
        ) {
          let c;
          u.slice(0, n + 1).forEach((f, p, d) => {
            let h = c;
            (c = f.clone({ nodes: [] })), h && c.append(h);
            let y = [],
              b = (d[p - 1] || r).next();
            for (; b; ) y.push(b), (b = b.next());
            c.append(y);
          }),
            c && (a || t[t.length - 1]).after(c);
        }
      }
      r.remove();
    }
    var Oa = Symbol('rootRuleMergeSel'),
      Sp = Symbol('rootRuleEscapes');
    function Zk(r) {
      let { params: e } = r,
        { type: t, selector: i, escapes: n } = Jk(e);
      if (t === 'unknown')
        throw r.error(`Unknown @${r.name} parameter ${JSON.stringify(e)}`);
      if (t === 'basic' && i) {
        let s = new bp({ selector: i, nodes: r.nodes });
        r.removeAll(), r.append(s);
      }
      (r[Sp] = n), (r[Oa] = n ? !n('all') : t === 'noop');
    }
    var Ea = Symbol('hasRootRule');
    Ta.exports = (r = {}) => {
      let e = kp(['media', 'supports', 'layer', 'container'], r.bubble),
        t = Qk(e),
        i = kp(
          [
            'document',
            'font-face',
            'keyframes',
            '-webkit-keyframes',
            '-moz-keyframes',
          ],
          r.unwrap
        ),
        n = (r.rootRuleName || 'at-root').replace(/^@/, ''),
        s = r.preserveEmpty;
      return {
        postcssPlugin: 'postcss-nested',
        Once(a) {
          a.walkAtRules(n, (o) => {
            Zk(o), (a[Ea] = !0);
          });
        },
        Rule(a) {
          let o = !1,
            u = a,
            c = !1,
            f = [];
          a.each((p) => {
            p.type === 'rule'
              ? (f.length && ((u = Aa(a.selector, f, u)), (f = [])),
                (c = !0),
                (o = !0),
                (p.selectors = xp(a, p)),
                (u = tn(p, u)))
              : p.type === 'atrule'
              ? (f.length && ((u = Aa(a.selector, f, u)), (f = [])),
                p.name === n
                  ? ((o = !0), t(a, p, !0, p[Oa]), (u = tn(p, u)))
                  : e[p.name]
                  ? ((c = !0), (o = !0), t(a, p, !0), (u = tn(p, u)))
                  : i[p.name]
                  ? ((c = !0), (o = !0), t(a, p, !1), (u = tn(p, u)))
                  : c && f.push(p))
              : p.type === 'decl' && c && f.push(p);
          }),
            f.length && (u = Aa(a.selector, f, u)),
            o &&
              s !== !0 &&
              ((a.raws.semicolon = !0), a.nodes.length === 0 && a.remove());
        },
        RootExit(a) {
          a[Ea] && (a.walkAtRules(n, Kk), (a[Ea] = !1));
        },
      };
    };
    Ta.exports.postcss = !0;
  });
  var Ep = v((VT, Op) => {
    l();
    ('use strict');
    var Cp = /-(\w|$)/g,
      Ap = (r, e) => e.toUpperCase(),
      eS = (r) => (
        (r = r.toLowerCase()),
        r === 'float'
          ? 'cssFloat'
          : r.startsWith('-ms-')
          ? r.substr(1).replace(Cp, Ap)
          : r.replace(Cp, Ap)
      );
    Op.exports = eS;
  });
  var Ia = v((UT, Tp) => {
    l();
    var tS = Ep(),
      rS = {
        boxFlex: !0,
        boxFlexGroup: !0,
        columnCount: !0,
        flex: !0,
        flexGrow: !0,
        flexPositive: !0,
        flexShrink: !0,
        flexNegative: !0,
        fontWeight: !0,
        lineClamp: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        tabSize: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        fillOpacity: !0,
        strokeDashoffset: !0,
        strokeOpacity: !0,
        strokeWidth: !0,
      };
    function Pa(r) {
      return typeof r.nodes == 'undefined' ? !0 : Da(r);
    }
    function Da(r) {
      let e,
        t = {};
      return (
        r.each((i) => {
          if (i.type === 'atrule')
            (e = '@' + i.name),
              i.params && (e += ' ' + i.params),
              typeof t[e] == 'undefined'
                ? (t[e] = Pa(i))
                : Array.isArray(t[e])
                ? t[e].push(Pa(i))
                : (t[e] = [t[e], Pa(i)]);
          else if (i.type === 'rule') {
            let n = Da(i);
            if (t[i.selector]) for (let s in n) t[i.selector][s] = n[s];
            else t[i.selector] = n;
          } else if (i.type === 'decl') {
            (i.prop[0] === '-' && i.prop[1] === '-') ||
            (i.parent && i.parent.selector === ':export')
              ? (e = i.prop)
              : (e = tS(i.prop));
            let n = i.value;
            !isNaN(i.value) && rS[e] && (n = parseFloat(i.value)),
              i.important && (n += ' !important'),
              typeof t[e] == 'undefined'
                ? (t[e] = n)
                : Array.isArray(t[e])
                ? t[e].push(n)
                : (t[e] = [t[e], n]);
          }
        }),
        t
      );
    }
    Tp.exports = Da;
  });
  var rn = v((WT, qp) => {
    l();
    var Gr = me(),
      Pp = /\s*!important\s*$/i,
      iS = {
        'box-flex': !0,
        'box-flex-group': !0,
        'column-count': !0,
        flex: !0,
        'flex-grow': !0,
        'flex-positive': !0,
        'flex-shrink': !0,
        'flex-negative': !0,
        'font-weight': !0,
        'line-clamp': !0,
        'line-height': !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        'tab-size': !0,
        widows: !0,
        'z-index': !0,
        zoom: !0,
        'fill-opacity': !0,
        'stroke-dashoffset': !0,
        'stroke-opacity': !0,
        'stroke-width': !0,
      };
    function nS(r) {
      return r
        .replace(/([A-Z])/g, '-$1')
        .replace(/^ms-/, '-ms-')
        .toLowerCase();
    }
    function Dp(r, e, t) {
      t === !1 ||
        t === null ||
        (e.startsWith('--') || (e = nS(e)),
        typeof t == 'number' &&
          (t === 0 || iS[e] ? (t = t.toString()) : (t += 'px')),
        e === 'css-float' && (e = 'float'),
        Pp.test(t)
          ? ((t = t.replace(Pp, '')),
            r.push(Gr.decl({ prop: e, value: t, important: !0 })))
          : r.push(Gr.decl({ prop: e, value: t })));
    }
    function Ip(r, e, t) {
      let i = Gr.atRule({ name: e[1], params: e[3] || '' });
      typeof t == 'object' && ((i.nodes = []), qa(t, i)), r.push(i);
    }
    function qa(r, e) {
      let t, i, n;
      for (t in r)
        if (((i = r[t]), !(i === null || typeof i == 'undefined')))
          if (t[0] === '@') {
            let s = t.match(/@(\S+)(\s+([\W\w]*)\s*)?/);
            if (Array.isArray(i)) for (let a of i) Ip(e, s, a);
            else Ip(e, s, i);
          } else if (Array.isArray(i)) for (let s of i) Dp(e, t, s);
          else
            typeof i == 'object'
              ? ((n = Gr.rule({ selector: t })), qa(i, n), e.push(n))
              : Dp(e, t, i);
    }
    qp.exports = function (r) {
      let e = Gr.root();
      return qa(r, e), e;
    };
  });
  var Ra = v((GT, Rp) => {
    l();
    var sS = Ia();
    Rp.exports = function (e) {
      return (
        console &&
          console.warn &&
          e.warnings().forEach((t) => {
            let i = t.plugin || 'PostCSS';
            console.warn(i + ': ' + t.text);
          }),
        sS(e.root)
      );
    };
  });
  var Fp = v((HT, Mp) => {
    l();
    var aS = me(),
      oS = Ra(),
      lS = rn();
    Mp.exports = function (e) {
      let t = aS(e);
      return async (i) => {
        let n = await t.process(i, { parser: lS, from: void 0 });
        return oS(n);
      };
    };
  });
  var Lp = v((YT, Np) => {
    l();
    var uS = me(),
      fS = Ra(),
      cS = rn();
    Np.exports = function (r) {
      let e = uS(r);
      return (t) => {
        let i = e.process(t, { parser: cS, from: void 0 });
        return fS(i);
      };
    };
  });
  var $p = v((QT, Bp) => {
    l();
    var pS = Ia(),
      dS = rn(),
      hS = Fp(),
      mS = Lp();
    Bp.exports = { objectify: pS, parse: dS, async: hS, sync: mS };
  });
  var Dt,
    jp,
    JT,
    XT,
    KT,
    ZT,
    zp = C(() => {
      l();
      (Dt = K($p())),
        (jp = Dt.default),
        (JT = Dt.default.objectify),
        (XT = Dt.default.parse),
        (KT = Dt.default.async),
        (ZT = Dt.default.sync);
    });
  function It(r) {
    return Array.isArray(r)
      ? r.flatMap(
          (e) =>
            j([(0, Vp.default)({ bubble: ['screen'] })]).process(e, {
              parser: jp,
            }).root.nodes
        )
      : It([r]);
  }
  var Vp,
    Ma = C(() => {
      l();
      it();
      Vp = K(_p());
      zp();
    });
  function qt(r, e, t = !1) {
    if (r === '') return e;
    let i = typeof e == 'string' ? (0, Up.default)().astSync(e) : e;
    return (
      i.walkClasses((n) => {
        let s = n.value,
          a = t && s.startsWith('-');
        n.value = a ? `-${r}${s.slice(1)}` : `${r}${s}`;
      }),
      typeof e == 'string' ? i.toString() : i
    );
  }
  var Up,
    nn = C(() => {
      l();
      Up = K(Me());
    });
  function ce(r) {
    let e = Wp.default.className();
    return (e.value = r), pt(e?.raws?.value ?? e.value);
  }
  var Wp,
    Rt = C(() => {
      l();
      Wp = K(Me());
      fi();
    });
  function Fa(r) {
    return pt(`.${ce(r)}`);
  }
  function sn(r, e) {
    return Fa(Hr(r, e));
  }
  function Hr(r, e) {
    return e === 'DEFAULT'
      ? r
      : e === '-' || e === '-DEFAULT'
      ? `-${r}`
      : e.startsWith('-')
      ? `-${r}${e}`
      : e.startsWith('/')
      ? `${r}${e}`
      : `${r}-${e}`;
  }
  var Na = C(() => {
    l();
    Rt();
    fi();
  });
  function T(r, e = [[r, [r]]], { filterDefault: t = !1, ...i } = {}) {
    let n = We(r);
    return function ({ matchUtilities: s, theme: a }) {
      for (let o of e) {
        let u = Array.isArray(o[0]) ? o : [o];
        s(
          u.reduce(
            (c, [f, p]) =>
              Object.assign(c, {
                [f]: (d) =>
                  p.reduce(
                    (h, y) =>
                      Array.isArray(y)
                        ? Object.assign(h, { [y[0]]: y[1] })
                        : Object.assign(h, { [y]: n(d) }),
                    {}
                  ),
              }),
            {}
          ),
          {
            ...i,
            values: t
              ? Object.fromEntries(
                  Object.entries(a(r) ?? {}).filter(([c]) => c !== 'DEFAULT')
                )
              : a(r),
          }
        );
      }
    };
  }
  var Gp = C(() => {
    l();
    Wr();
  });
  function nt(r) {
    return (
      (r = Array.isArray(r) ? r : [r]),
      r
        .map((e) => {
          let t = e.values.map((i) =>
            i.raw !== void 0
              ? i.raw
              : [
                  i.min && `(min-width: ${i.min})`,
                  i.max && `(max-width: ${i.max})`,
                ]
                  .filter(Boolean)
                  .join(' and ')
          );
          return e.not ? `not all and ${t}` : t;
        })
        .join(', ')
    );
  }
  var an = C(() => {
    l();
  });
  function La(r) {
    return r.split(kS).map((t) => {
      let i = t.trim(),
        n = { value: i },
        s = i.split(SS),
        a = new Set();
      for (let o of s)
        !a.has('DIRECTIONS') && gS.has(o)
          ? ((n.direction = o), a.add('DIRECTIONS'))
          : !a.has('PLAY_STATES') && yS.has(o)
          ? ((n.playState = o), a.add('PLAY_STATES'))
          : !a.has('FILL_MODES') && bS.has(o)
          ? ((n.fillMode = o), a.add('FILL_MODES'))
          : !a.has('ITERATION_COUNTS') && (wS.has(o) || _S.test(o))
          ? ((n.iterationCount = o), a.add('ITERATION_COUNTS'))
          : (!a.has('TIMING_FUNCTION') && vS.has(o)) ||
            (!a.has('TIMING_FUNCTION') && xS.some((u) => o.startsWith(`${u}(`)))
          ? ((n.timingFunction = o), a.add('TIMING_FUNCTION'))
          : !a.has('DURATION') && Hp.test(o)
          ? ((n.duration = o), a.add('DURATION'))
          : !a.has('DELAY') && Hp.test(o)
          ? ((n.delay = o), a.add('DELAY'))
          : a.has('NAME')
          ? (n.unknown || (n.unknown = []), n.unknown.push(o))
          : ((n.name = o), a.add('NAME'));
      return n;
    });
  }
  var gS,
    yS,
    bS,
    wS,
    vS,
    xS,
    kS,
    SS,
    Hp,
    _S,
    Yp = C(() => {
      l();
      (gS = new Set(['normal', 'reverse', 'alternate', 'alternate-reverse'])),
        (yS = new Set(['running', 'paused'])),
        (bS = new Set(['none', 'forwards', 'backwards', 'both'])),
        (wS = new Set(['infinite'])),
        (vS = new Set([
          'linear',
          'ease',
          'ease-in',
          'ease-out',
          'ease-in-out',
          'step-start',
          'step-end',
        ])),
        (xS = ['cubic-bezier', 'steps']),
        (kS = /\,(?![^(]*\))/g),
        (SS = /\ +(?![^(]*\))/g),
        (Hp = /^(-?[\d.]+m?s)$/),
        (_S = /^(\d+)$/);
    });
  var Qp,
    ne,
    Jp = C(() => {
      l();
      (Qp = (r) =>
        Object.assign(
          {},
          ...Object.entries(r ?? {}).flatMap(([e, t]) =>
            typeof t == 'object'
              ? Object.entries(Qp(t)).map(([i, n]) => ({
                  [e + (i === 'DEFAULT' ? '' : `-${i}`)]: n,
                }))
              : [{ [`${e}`]: t }]
          )
        )),
        (ne = Qp);
    });
  var CS,
    $a,
    AS,
    OS,
    ES,
    TS,
    PS,
    DS,
    IS,
    qS,
    RS,
    MS,
    FS,
    NS,
    LS,
    BS,
    $S,
    jS,
    ja,
    Ba = C(() => {
      (CS = 'tailwindcss'),
        ($a = '3.3.2'),
        (AS =
          'A utility-first CSS framework for rapidly building custom user interfaces.'),
        (OS = 'MIT'),
        (ES = 'lib/index.js'),
        (TS = 'types/index.d.ts'),
        (PS = 'https://github.com/tailwindlabs/tailwindcss.git'),
        (DS = 'https://github.com/tailwindlabs/tailwindcss/issues'),
        (IS = 'https://tailwindcss.com'),
        (qS = { tailwind: 'lib/cli.js', tailwindcss: 'lib/cli.js' }),
        (RS = { engine: 'stable' }),
        (MS = {
          prebuild: 'npm run generate && rimraf lib',
          build: `swc src --out-dir lib --copy-files --config jsc.transform.optimizer.globals.vars.__OXIDE__='"false"'`,
          postbuild:
            'esbuild lib/cli-peer-dependencies.js --bundle --platform=node --outfile=peers/index.js --define:process.env.CSS_TRANSFORMER_WASM=false',
          'rebuild-fixtures':
            'npm run build && node -r @swc/register scripts/rebuildFixtures.js',
          style: 'eslint .',
          pretest: 'npm run generate',
          test: 'jest',
          'test:integrations': 'npm run test --prefix ./integrations',
          'install:integrations': 'node scripts/install-integrations.js',
          'generate:plugin-list':
            'node -r @swc/register scripts/create-plugin-list.js',
          'generate:types': 'node -r @swc/register scripts/generate-types.js',
          generate: 'npm run generate:plugin-list && npm run generate:types',
          'release-channel': 'node ./scripts/release-channel.js',
          'release-notes': 'node ./scripts/release-notes.js',
          prepublishOnly: 'npm install --force && npm run build',
        }),
        (FS = [
          'src/*',
          'cli/*',
          'lib/*',
          'peers/*',
          'scripts/*.js',
          'stubs/*',
          'nesting/*',
          'types/**/*',
          '*.d.ts',
          '*.css',
          '*.js',
        ]),
        (NS = {
          '@swc/cli': '^0.1.62',
          '@swc/core': '^1.3.55',
          '@swc/jest': '^0.2.26',
          '@swc/register': '^0.1.10',
          autoprefixer: '^10.4.14',
          browserslist: '^4.21.5',
          concurrently: '^8.0.1',
          cssnano: '^6.0.0',
          esbuild: '^0.17.18',
          eslint: '^8.39.0',
          'eslint-config-prettier': '^8.8.0',
          'eslint-plugin-prettier': '^4.2.1',
          jest: '^29.5.0',
          'jest-diff': '^29.5.0',
          lightningcss: '1.18.0',
          prettier: '^2.8.8',
          rimraf: '^5.0.0',
          'source-map-js': '^1.0.2',
          turbo: '^1.9.3',
        }),
        (LS = {
          '@alloc/quick-lru': '^5.2.0',
          arg: '^5.0.2',
          chokidar: '^3.5.3',
          didyoumean: '^1.2.2',
          dlv: '^1.1.3',
          'fast-glob': '^3.2.12',
          'glob-parent': '^6.0.2',
          'is-glob': '^4.0.3',
          jiti: '^1.18.2',
          lilconfig: '^2.1.0',
          micromatch: '^4.0.5',
          'normalize-path': '^3.0.0',
          'object-hash': '^3.0.0',
          picocolors: '^1.0.0',
          postcss: '^8.4.23',
          'postcss-import': '^15.1.0',
          'postcss-js': '^4.0.1',
          'postcss-load-config': '^4.0.1',
          'postcss-nested': '^6.0.1',
          'postcss-selector-parser': '^6.0.11',
          'postcss-value-parser': '^4.2.0',
          resolve: '^1.22.2',
          sucrase: '^3.32.0',
        }),
        (BS = ['> 1%', 'not edge <= 18', 'not ie 11', 'not op_mini all']),
        ($S = {
          testTimeout: 3e4,
          setupFilesAfterEnv: ['<rootDir>/jest/customMatchers.js'],
          testPathIgnorePatterns: [
            '/node_modules/',
            '/integrations/',
            '/standalone-cli/',
            '\\.test\\.skip\\.js$',
          ],
          transformIgnorePatterns: ['node_modules/(?!lightningcss)'],
          transform: { '\\.js$': '@swc/jest', '\\.ts$': '@swc/jest' },
        }),
        (jS = { node: '>=14.0.0' }),
        (ja = {
          name: CS,
          version: $a,
          description: AS,
          license: OS,
          main: ES,
          types: TS,
          repository: PS,
          bugs: DS,
          homepage: IS,
          bin: qS,
          tailwindcss: RS,
          scripts: MS,
          files: FS,
          devDependencies: NS,
          dependencies: LS,
          browserslist: BS,
          jest: $S,
          engines: jS,
        });
    });
  function st(r, e = !0) {
    return Array.isArray(r)
      ? r.map((t) => {
          if (e && Array.isArray(t))
            throw new Error('The tuple syntax is not supported for `screens`.');
          if (typeof t == 'string')
            return {
              name: t.toString(),
              not: !1,
              values: [{ min: t, max: void 0 }],
            };
          let [i, n] = t;
          return (
            (i = i.toString()),
            typeof n == 'string'
              ? { name: i, not: !1, values: [{ min: n, max: void 0 }] }
              : Array.isArray(n)
              ? { name: i, not: !1, values: n.map((s) => Kp(s)) }
              : { name: i, not: !1, values: [Kp(n)] }
          );
        })
      : st(Object.entries(r ?? {}), !1);
  }
  function on(r) {
    return r.values.length !== 1
      ? { result: !1, reason: 'multiple-values' }
      : r.values[0].raw !== void 0
      ? { result: !1, reason: 'raw-values' }
      : r.values[0].min !== void 0 && r.values[0].max !== void 0
      ? { result: !1, reason: 'min-and-max' }
      : { result: !0, reason: null };
  }
  function Xp(r, e, t) {
    let i = ln(e, r),
      n = ln(t, r),
      s = on(i),
      a = on(n);
    if (s.reason === 'multiple-values' || a.reason === 'multiple-values')
      throw new Error(
        'Attempted to sort a screen with multiple values. This should never happen. Please open a bug report.'
      );
    if (s.reason === 'raw-values' || a.reason === 'raw-values')
      throw new Error(
        'Attempted to sort a screen with raw values. This should never happen. Please open a bug report.'
      );
    if (s.reason === 'min-and-max' || a.reason === 'min-and-max')
      throw new Error(
        'Attempted to sort a screen with both min and max values. This should never happen. Please open a bug report.'
      );
    let { min: o, max: u } = i.values[0],
      { min: c, max: f } = n.values[0];
    e.not && ([o, u] = [u, o]),
      t.not && ([c, f] = [f, c]),
      (o = o === void 0 ? o : parseFloat(o)),
      (u = u === void 0 ? u : parseFloat(u)),
      (c = c === void 0 ? c : parseFloat(c)),
      (f = f === void 0 ? f : parseFloat(f));
    let [p, d] = r === 'min' ? [o, c] : [f, u];
    return p - d;
  }
  function ln(r, e) {
    return typeof r == 'object'
      ? r
      : { name: 'arbitrary-screen', values: [{ [e]: r }] };
  }
  function Kp({ 'min-width': r, min: e = r, max: t, raw: i } = {}) {
    return { min: e, max: t, raw: i };
  }
  var un = C(() => {
    l();
  });
  function fn(r, e) {
    r.walkDecls((t) => {
      if (e.includes(t.prop)) {
        t.remove();
        return;
      }
      for (let i of e)
        t.value.includes(`/ var(${i})`) &&
          (t.value = t.value.replace(`/ var(${i})`, ''));
    });
  }
  var Zp = C(() => {
    l();
  });
  var pe,
    Te,
    Fe,
    Ne,
    ed,
    td = C(() => {
      l();
      je();
      dt();
      it();
      Gp();
      an();
      Rt();
      Yp();
      Jp();
      nr();
      ns();
      vt();
      Wr();
      Ba();
      Oe();
      un();
      Xn();
      Zp();
      De();
      lr();
      (pe = {
        pseudoElementVariants: ({ addVariant: r }) => {
          r('first-letter', '&::first-letter'),
            r('first-line', '&::first-line'),
            r('marker', [
              ({ container: e }) => (
                fn(e, ['--tw-text-opacity']), '& *::marker'
              ),
              ({ container: e }) => (fn(e, ['--tw-text-opacity']), '&::marker'),
            ]),
            r('selection', ['& *::selection', '&::selection']),
            r('file', '&::file-selector-button'),
            r('placeholder', '&::placeholder'),
            r('backdrop', '&::backdrop'),
            r(
              'before',
              ({ container: e }) => (
                e.walkRules((t) => {
                  let i = !1;
                  t.walkDecls('content', () => {
                    i = !0;
                  }),
                    i ||
                      t.prepend(
                        j.decl({ prop: 'content', value: 'var(--tw-content)' })
                      );
                }),
                '&::before'
              )
            ),
            r(
              'after',
              ({ container: e }) => (
                e.walkRules((t) => {
                  let i = !1;
                  t.walkDecls('content', () => {
                    i = !0;
                  }),
                    i ||
                      t.prepend(
                        j.decl({ prop: 'content', value: 'var(--tw-content)' })
                      );
                }),
                '&::after'
              )
            );
        },
        pseudoClassVariants: ({
          addVariant: r,
          matchVariant: e,
          config: t,
        }) => {
          let i = [
            ['first', '&:first-child'],
            ['last', '&:last-child'],
            ['only', '&:only-child'],
            ['odd', '&:nth-child(odd)'],
            ['even', '&:nth-child(even)'],
            'first-of-type',
            'last-of-type',
            'only-of-type',
            [
              'visited',
              ({ container: s }) => (
                fn(s, [
                  '--tw-text-opacity',
                  '--tw-border-opacity',
                  '--tw-bg-opacity',
                ]),
                '&:visited'
              ),
            ],
            'target',
            ['open', '&[open]'],
            'default',
            'checked',
            'indeterminate',
            'placeholder-shown',
            'autofill',
            'optional',
            'required',
            'valid',
            'invalid',
            'in-range',
            'out-of-range',
            'read-only',
            'empty',
            'focus-within',
            [
              'hover',
              J(t(), 'hoverOnlyWhenSupported')
                ? '@media (hover: hover) and (pointer: fine) { &:hover }'
                : '&:hover',
            ],
            'focus',
            'focus-visible',
            'active',
            'enabled',
            'disabled',
          ].map((s) => (Array.isArray(s) ? s : [s, `&:${s}`]));
          for (let [s, a] of i)
            r(s, (o) => (typeof a == 'function' ? a(o) : a));
          let n = {
            group: (s, { modifier: a }) =>
              a
                ? [`:merge(.group\\/${ce(a)})`, ' &']
                : [':merge(.group)', ' &'],
            peer: (s, { modifier: a }) =>
              a
                ? [`:merge(.peer\\/${ce(a)})`, ' ~ &']
                : [':merge(.peer)', ' ~ &'],
          };
          for (let [s, a] of Object.entries(n))
            e(
              s,
              (o = '', u) => {
                let c = V(typeof o == 'function' ? o(u) : o);
                c.includes('&') || (c = '&' + c);
                let [f, p] = a('', u),
                  d = null,
                  h = null,
                  y = 0;
                for (let x = 0; x < c.length; ++x) {
                  let b = c[x];
                  b === '&'
                    ? (d = x)
                    : b === "'" || b === '"'
                    ? (y += 1)
                    : d !== null && b === ' ' && !y && (h = x);
                }
                return (
                  d !== null && h === null && (h = c.length),
                  c.slice(0, d) + f + c.slice(d + 1, h) + p + c.slice(h)
                );
              },
              { values: Object.fromEntries(i) }
            );
        },
        directionVariants: ({ addVariant: r }) => {
          r('ltr', ':is([dir="ltr"] &)'), r('rtl', ':is([dir="rtl"] &)');
        },
        reducedMotionVariants: ({ addVariant: r }) => {
          r('motion-safe', '@media (prefers-reduced-motion: no-preference)'),
            r('motion-reduce', '@media (prefers-reduced-motion: reduce)');
        },
        darkVariants: ({ config: r, addVariant: e }) => {
          let [t, i = '.dark'] = [].concat(r('darkMode', 'media'));
          t === !1 &&
            ((t = 'media'),
            N.warn('darkmode-false', [
              'The `darkMode` option in your Tailwind CSS configuration is set to `false`, which now behaves the same as `media`.',
              'Change `darkMode` to `media` or remove it entirely.',
              'https://tailwindcss.com/docs/upgrade-guide#remove-dark-mode-configuration',
            ])),
            t === 'class'
              ? e('dark', `:is(${i} &)`)
              : t === 'media' &&
                e('dark', '@media (prefers-color-scheme: dark)');
        },
        printVariant: ({ addVariant: r }) => {
          r('print', '@media print');
        },
        screenVariants: ({ theme: r, addVariant: e, matchVariant: t }) => {
          let i = r('screens') ?? {},
            n = Object.values(i).every((w) => typeof w == 'string'),
            s = st(r('screens')),
            a = new Set([]);
          function o(w) {
            return w.match(/(\D+)$/)?.[1] ?? '(none)';
          }
          function u(w) {
            w !== void 0 && a.add(o(w));
          }
          function c(w) {
            return u(w), a.size === 1;
          }
          for (let w of s) for (let k of w.values) u(k.min), u(k.max);
          let f = a.size <= 1;
          function p(w) {
            return Object.fromEntries(
              s
                .filter((k) => on(k).result)
                .map((k) => {
                  let { min: S, max: _ } = k.values[0];
                  if (w === 'min' && S !== void 0) return k;
                  if (w === 'min' && _ !== void 0) return { ...k, not: !k.not };
                  if (w === 'max' && _ !== void 0) return k;
                  if (w === 'max' && S !== void 0) return { ...k, not: !k.not };
                })
                .map((k) => [k.name, k])
            );
          }
          function d(w) {
            return (k, S) => Xp(w, k.value, S.value);
          }
          let h = d('max'),
            y = d('min');
          function x(w) {
            return (k) => {
              if (n)
                if (f) {
                  if (typeof k == 'string' && !c(k))
                    return (
                      N.warn('minmax-have-mixed-units', [
                        'The `min-*` and `max-*` variants are not supported with a `screens` configuration containing mixed units.',
                      ]),
                      []
                    );
                } else
                  return (
                    N.warn('mixed-screen-units', [
                      'The `min-*` and `max-*` variants are not supported with a `screens` configuration containing mixed units.',
                    ]),
                    []
                  );
              else
                return (
                  N.warn('complex-screen-config', [
                    'The `min-*` and `max-*` variants are not supported with a `screens` configuration containing objects.',
                  ]),
                  []
                );
              return [`@media ${nt(ln(k, w))}`];
            };
          }
          t('max', x('max'), { sort: h, values: n ? p('max') : {} });
          let b = 'min-screens';
          for (let w of s)
            e(w.name, `@media ${nt(w)}`, {
              id: b,
              sort: n && f ? y : void 0,
              value: w,
            });
          t('min', x('min'), { id: b, sort: y });
        },
        supportsVariants: ({ matchVariant: r, theme: e }) => {
          r(
            'supports',
            (t = '') => {
              let i = V(t),
                n = /^\w*\s*\(/.test(i);
              return (
                (i = n ? i.replace(/\b(and|or|not)\b/g, ' $1 ') : i),
                n
                  ? `@supports ${i}`
                  : (i.includes(':') || (i = `${i}: var(--tw)`),
                    (i.startsWith('(') && i.endsWith(')')) || (i = `(${i})`),
                    `@supports ${i}`)
              );
            },
            { values: e('supports') ?? {} }
          );
        },
        ariaVariants: ({ matchVariant: r, theme: e }) => {
          r('aria', (t) => `&[aria-${V(t)}]`, { values: e('aria') ?? {} }),
            r(
              'group-aria',
              (t, { modifier: i }) =>
                i
                  ? `:merge(.group\\/${i})[aria-${V(t)}] &`
                  : `:merge(.group)[aria-${V(t)}] &`,
              { values: e('aria') ?? {} }
            ),
            r(
              'peer-aria',
              (t, { modifier: i }) =>
                i
                  ? `:merge(.peer\\/${i})[aria-${V(t)}] ~ &`
                  : `:merge(.peer)[aria-${V(t)}] ~ &`,
              { values: e('aria') ?? {} }
            );
        },
        dataVariants: ({ matchVariant: r, theme: e }) => {
          r('data', (t) => `&[data-${V(t)}]`, { values: e('data') ?? {} }),
            r(
              'group-data',
              (t, { modifier: i }) =>
                i
                  ? `:merge(.group\\/${i})[data-${V(t)}] &`
                  : `:merge(.group)[data-${V(t)}] &`,
              { values: e('data') ?? {} }
            ),
            r(
              'peer-data',
              (t, { modifier: i }) =>
                i
                  ? `:merge(.peer\\/${i})[data-${V(t)}] ~ &`
                  : `:merge(.peer)[data-${V(t)}] ~ &`,
              { values: e('data') ?? {} }
            );
        },
        orientationVariants: ({ addVariant: r }) => {
          r('portrait', '@media (orientation: portrait)'),
            r('landscape', '@media (orientation: landscape)');
        },
        prefersContrastVariants: ({ addVariant: r }) => {
          r('contrast-more', '@media (prefers-contrast: more)'),
            r('contrast-less', '@media (prefers-contrast: less)');
        },
      }),
        (Te = [
          'translate(var(--tw-translate-x), var(--tw-translate-y))',
          'rotate(var(--tw-rotate))',
          'skewX(var(--tw-skew-x))',
          'skewY(var(--tw-skew-y))',
          'scaleX(var(--tw-scale-x))',
          'scaleY(var(--tw-scale-y))',
        ].join(' ')),
        (Fe = [
          'var(--tw-blur)',
          'var(--tw-brightness)',
          'var(--tw-contrast)',
          'var(--tw-grayscale)',
          'var(--tw-hue-rotate)',
          'var(--tw-invert)',
          'var(--tw-saturate)',
          'var(--tw-sepia)',
          'var(--tw-drop-shadow)',
        ].join(' ')),
        (Ne = [
          'var(--tw-backdrop-blur)',
          'var(--tw-backdrop-brightness)',
          'var(--tw-backdrop-contrast)',
          'var(--tw-backdrop-grayscale)',
          'var(--tw-backdrop-hue-rotate)',
          'var(--tw-backdrop-invert)',
          'var(--tw-backdrop-opacity)',
          'var(--tw-backdrop-saturate)',
          'var(--tw-backdrop-sepia)',
        ].join(' ')),
        (ed = {
          preflight: ({ addBase: r }) => {
            let e = j.parse(
              `*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:theme('borderColor.DEFAULT', currentColor)}::after,::before{--tw-content:''}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:theme('fontFamily.sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");font-feature-settings:theme('fontFamily.sans[1].fontFeatureSettings', normal);font-variation-settings:theme('fontFamily.sans[1].fontVariationSettings', normal)}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:theme('fontFamily.mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:theme('colors.gray.4', #9ca3af)}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}`
            );
            r([
              j.comment({
                text: `! tailwindcss v${$a} | MIT License | https://tailwindcss.com`,
              }),
              ...e.nodes,
            ]);
          },
          container: (() => {
            function r(t = []) {
              return t
                .flatMap((i) => i.values.map((n) => n.min))
                .filter((i) => i !== void 0);
            }
            function e(t, i, n) {
              if (typeof n == 'undefined') return [];
              if (!(typeof n == 'object' && n !== null))
                return [{ screen: 'DEFAULT', minWidth: 0, padding: n }];
              let s = [];
              n.DEFAULT &&
                s.push({ screen: 'DEFAULT', minWidth: 0, padding: n.DEFAULT });
              for (let a of t)
                for (let o of i)
                  for (let { min: u } of o.values)
                    u === a && s.push({ minWidth: a, padding: n[o.name] });
              return s;
            }
            return function ({ addComponents: t, theme: i }) {
              let n = st(i('container.screens', i('screens'))),
                s = r(n),
                a = e(s, n, i('container.padding')),
                o = (c) => {
                  let f = a.find((p) => p.minWidth === c);
                  return f
                    ? { paddingRight: f.padding, paddingLeft: f.padding }
                    : {};
                },
                u = Array.from(
                  new Set(s.slice().sort((c, f) => parseInt(c) - parseInt(f)))
                ).map((c) => ({
                  [`@media (min-width: ${c})`]: {
                    '.container': { 'max-width': c, ...o(c) },
                  },
                }));
              t([
                {
                  '.container': Object.assign(
                    { width: '100%' },
                    i('container.center', !1)
                      ? { marginRight: 'auto', marginLeft: 'auto' }
                      : {},
                    o(0)
                  ),
                },
                ...u,
              ]);
            };
          })(),
          accessibility: ({ addUtilities: r }) => {
            r({
              '.sr-only': {
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: '0',
              },
              '.not-sr-only': {
                position: 'static',
                width: 'auto',
                height: 'auto',
                padding: '0',
                margin: '0',
                overflow: 'visible',
                clip: 'auto',
                whiteSpace: 'normal',
              },
            });
          },
          pointerEvents: ({ addUtilities: r }) => {
            r({
              '.pointer-events-none': { 'pointer-events': 'none' },
              '.pointer-events-auto': { 'pointer-events': 'auto' },
            });
          },
          visibility: ({ addUtilities: r }) => {
            r({
              '.visible': { visibility: 'visible' },
              '.invisible': { visibility: 'hidden' },
              '.collapse': { visibility: 'collapse' },
            });
          },
          position: ({ addUtilities: r }) => {
            r({
              '.static': { position: 'static' },
              '.fixed': { position: 'fixed' },
              '.absolute': { position: 'absolute' },
              '.relative': { position: 'relative' },
              '.sticky': { position: 'sticky' },
            });
          },
          inset: T(
            'inset',
            [
              ['inset', ['inset']],
              [
                ['inset-x', ['left', 'right']],
                ['inset-y', ['top', 'bottom']],
              ],
              [
                ['start', ['inset-inline-start']],
                ['end', ['inset-inline-end']],
                ['top', ['top']],
                ['right', ['right']],
                ['bottom', ['bottom']],
                ['left', ['left']],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          isolation: ({ addUtilities: r }) => {
            r({
              '.isolate': { isolation: 'isolate' },
              '.isolation-auto': { isolation: 'auto' },
            });
          },
          zIndex: T('zIndex', [['z', ['zIndex']]], {
            supportsNegativeValues: !0,
          }),
          order: T('order', void 0, { supportsNegativeValues: !0 }),
          gridColumn: T('gridColumn', [['col', ['gridColumn']]]),
          gridColumnStart: T('gridColumnStart', [
            ['col-start', ['gridColumnStart']],
          ]),
          gridColumnEnd: T('gridColumnEnd', [['col-end', ['gridColumnEnd']]]),
          gridRow: T('gridRow', [['row', ['gridRow']]]),
          gridRowStart: T('gridRowStart', [['row-start', ['gridRowStart']]]),
          gridRowEnd: T('gridRowEnd', [['row-end', ['gridRowEnd']]]),
          float: ({ addUtilities: r }) => {
            r({
              '.float-right': { float: 'right' },
              '.float-left': { float: 'left' },
              '.float-none': { float: 'none' },
            });
          },
          clear: ({ addUtilities: r }) => {
            r({
              '.clear-left': { clear: 'left' },
              '.clear-right': { clear: 'right' },
              '.clear-both': { clear: 'both' },
              '.clear-none': { clear: 'none' },
            });
          },
          margin: T(
            'margin',
            [
              ['m', ['margin']],
              [
                ['mx', ['margin-left', 'margin-right']],
                ['my', ['margin-top', 'margin-bottom']],
              ],
              [
                ['ms', ['margin-inline-start']],
                ['me', ['margin-inline-end']],
                ['mt', ['margin-top']],
                ['mr', ['margin-right']],
                ['mb', ['margin-bottom']],
                ['ml', ['margin-left']],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          boxSizing: ({ addUtilities: r }) => {
            r({
              '.box-border': { 'box-sizing': 'border-box' },
              '.box-content': { 'box-sizing': 'content-box' },
            });
          },
          lineClamp: ({ matchUtilities: r, addUtilities: e, theme: t }) => {
            r(
              {
                'line-clamp': (i) => ({
                  overflow: 'hidden',
                  display: '-webkit-box',
                  '-webkit-box-orient': 'vertical',
                  '-webkit-line-clamp': `${i}`,
                }),
              },
              { values: t('lineClamp') }
            ),
              e({
                '.line-clamp-none': {
                  overflow: 'visible',
                  display: 'block',
                  '-webkit-box-orient': 'horizontal',
                  '-webkit-line-clamp': 'none',
                },
              });
          },
          display: ({ addUtilities: r }) => {
            r({
              '.block': { display: 'block' },
              '.inline-block': { display: 'inline-block' },
              '.inline': { display: 'inline' },
              '.flex': { display: 'flex' },
              '.inline-flex': { display: 'inline-flex' },
              '.table': { display: 'table' },
              '.inline-table': { display: 'inline-table' },
              '.table-caption': { display: 'table-caption' },
              '.table-cell': { display: 'table-cell' },
              '.table-column': { display: 'table-column' },
              '.table-column-group': { display: 'table-column-group' },
              '.table-footer-group': { display: 'table-footer-group' },
              '.table-header-group': { display: 'table-header-group' },
              '.table-row-group': { display: 'table-row-group' },
              '.table-row': { display: 'table-row' },
              '.flow-root': { display: 'flow-root' },
              '.grid': { display: 'grid' },
              '.inline-grid': { display: 'inline-grid' },
              '.contents': { display: 'contents' },
              '.list-item': { display: 'list-item' },
              '.hidden': { display: 'none' },
            });
          },
          aspectRatio: T('aspectRatio', [['aspect', ['aspect-ratio']]]),
          height: T('height', [['h', ['height']]]),
          maxHeight: T('maxHeight', [['max-h', ['maxHeight']]]),
          minHeight: T('minHeight', [['min-h', ['minHeight']]]),
          width: T('width', [['w', ['width']]]),
          minWidth: T('minWidth', [['min-w', ['minWidth']]]),
          maxWidth: T('maxWidth', [['max-w', ['maxWidth']]]),
          flex: T('flex'),
          flexShrink: T('flexShrink', [
            ['flex-shrink', ['flex-shrink']],
            ['shrink', ['flex-shrink']],
          ]),
          flexGrow: T('flexGrow', [
            ['flex-grow', ['flex-grow']],
            ['grow', ['flex-grow']],
          ]),
          flexBasis: T('flexBasis', [['basis', ['flex-basis']]]),
          tableLayout: ({ addUtilities: r }) => {
            r({
              '.table-auto': { 'table-layout': 'auto' },
              '.table-fixed': { 'table-layout': 'fixed' },
            });
          },
          captionSide: ({ addUtilities: r }) => {
            r({
              '.caption-top': { 'caption-side': 'top' },
              '.caption-bottom': { 'caption-side': 'bottom' },
            });
          },
          borderCollapse: ({ addUtilities: r }) => {
            r({
              '.border-collapse': { 'border-collapse': 'collapse' },
              '.border-separate': { 'border-collapse': 'separate' },
            });
          },
          borderSpacing: ({ addDefaults: r, matchUtilities: e, theme: t }) => {
            r('border-spacing', {
              '--tw-border-spacing-x': 0,
              '--tw-border-spacing-y': 0,
            }),
              e(
                {
                  'border-spacing': (i) => ({
                    '--tw-border-spacing-x': i,
                    '--tw-border-spacing-y': i,
                    '@defaults border-spacing': {},
                    'border-spacing':
                      'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
                  }),
                  'border-spacing-x': (i) => ({
                    '--tw-border-spacing-x': i,
                    '@defaults border-spacing': {},
                    'border-spacing':
                      'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
                  }),
                  'border-spacing-y': (i) => ({
                    '--tw-border-spacing-y': i,
                    '@defaults border-spacing': {},
                    'border-spacing':
                      'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
                  }),
                },
                { values: t('borderSpacing') }
              );
          },
          transformOrigin: T('transformOrigin', [
            ['origin', ['transformOrigin']],
          ]),
          translate: T(
            'translate',
            [
              [
                [
                  'translate-x',
                  [
                    ['@defaults transform', {}],
                    '--tw-translate-x',
                    ['transform', Te],
                  ],
                ],
                [
                  'translate-y',
                  [
                    ['@defaults transform', {}],
                    '--tw-translate-y',
                    ['transform', Te],
                  ],
                ],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          rotate: T(
            'rotate',
            [
              [
                'rotate',
                [['@defaults transform', {}], '--tw-rotate', ['transform', Te]],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          skew: T(
            'skew',
            [
              [
                [
                  'skew-x',
                  [
                    ['@defaults transform', {}],
                    '--tw-skew-x',
                    ['transform', Te],
                  ],
                ],
                [
                  'skew-y',
                  [
                    ['@defaults transform', {}],
                    '--tw-skew-y',
                    ['transform', Te],
                  ],
                ],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          scale: T(
            'scale',
            [
              [
                'scale',
                [
                  ['@defaults transform', {}],
                  '--tw-scale-x',
                  '--tw-scale-y',
                  ['transform', Te],
                ],
              ],
              [
                [
                  'scale-x',
                  [
                    ['@defaults transform', {}],
                    '--tw-scale-x',
                    ['transform', Te],
                  ],
                ],
                [
                  'scale-y',
                  [
                    ['@defaults transform', {}],
                    '--tw-scale-y',
                    ['transform', Te],
                  ],
                ],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          transform: ({ addDefaults: r, addUtilities: e }) => {
            r('transform', {
              '--tw-translate-x': '0',
              '--tw-translate-y': '0',
              '--tw-rotate': '0',
              '--tw-skew-x': '0',
              '--tw-skew-y': '0',
              '--tw-scale-x': '1',
              '--tw-scale-y': '1',
            }),
              e({
                '.transform': { '@defaults transform': {}, transform: Te },
                '.transform-cpu': { transform: Te },
                '.transform-gpu': {
                  transform: Te.replace(
                    'translate(var(--tw-translate-x), var(--tw-translate-y))',
                    'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)'
                  ),
                },
                '.transform-none': { transform: 'none' },
              });
          },
          animation: ({ matchUtilities: r, theme: e, config: t }) => {
            let i = (s) => `${t('prefix')}${ce(s)}`,
              n = Object.fromEntries(
                Object.entries(e('keyframes') ?? {}).map(([s, a]) => [
                  s,
                  { [`@keyframes ${i(s)}`]: a },
                ])
              );
            r(
              {
                animate: (s) => {
                  let a = La(s);
                  return [
                    ...a.flatMap((o) => n[o.name]),
                    {
                      animation: a
                        .map(({ name: o, value: u }) =>
                          o === void 0 || n[o] === void 0
                            ? u
                            : u.replace(o, i(o))
                        )
                        .join(', '),
                    },
                  ];
                },
              },
              { values: e('animation') }
            );
          },
          cursor: T('cursor'),
          touchAction: ({ addDefaults: r, addUtilities: e }) => {
            r('touch-action', {
              '--tw-pan-x': ' ',
              '--tw-pan-y': ' ',
              '--tw-pinch-zoom': ' ',
            });
            let t = 'var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)';
            e({
              '.touch-auto': { 'touch-action': 'auto' },
              '.touch-none': { 'touch-action': 'none' },
              '.touch-pan-x': {
                '@defaults touch-action': {},
                '--tw-pan-x': 'pan-x',
                'touch-action': t,
              },
              '.touch-pan-left': {
                '@defaults touch-action': {},
                '--tw-pan-x': 'pan-left',
                'touch-action': t,
              },
              '.touch-pan-right': {
                '@defaults touch-action': {},
                '--tw-pan-x': 'pan-right',
                'touch-action': t,
              },
              '.touch-pan-y': {
                '@defaults touch-action': {},
                '--tw-pan-y': 'pan-y',
                'touch-action': t,
              },
              '.touch-pan-up': {
                '@defaults touch-action': {},
                '--tw-pan-y': 'pan-up',
                'touch-action': t,
              },
              '.touch-pan-down': {
                '@defaults touch-action': {},
                '--tw-pan-y': 'pan-down',
                'touch-action': t,
              },
              '.touch-pinch-zoom': {
                '@defaults touch-action': {},
                '--tw-pinch-zoom': 'pinch-zoom',
                'touch-action': t,
              },
              '.touch-manipulation': { 'touch-action': 'manipulation' },
            });
          },
          userSelect: ({ addUtilities: r }) => {
            r({
              '.select-none': { 'user-select': 'none' },
              '.select-text': { 'user-select': 'text' },
              '.select-all': { 'user-select': 'all' },
              '.select-auto': { 'user-select': 'auto' },
            });
          },
          resize: ({ addUtilities: r }) => {
            r({
              '.resize-none': { resize: 'none' },
              '.resize-y': { resize: 'vertical' },
              '.resize-x': { resize: 'horizontal' },
              '.resize': { resize: 'both' },
            });
          },
          scrollSnapType: ({ addDefaults: r, addUtilities: e }) => {
            r('scroll-snap-type', {
              '--tw-scroll-snap-strictness': 'proximity',
            }),
              e({
                '.snap-none': { 'scroll-snap-type': 'none' },
                '.snap-x': {
                  '@defaults scroll-snap-type': {},
                  'scroll-snap-type': 'x var(--tw-scroll-snap-strictness)',
                },
                '.snap-y': {
                  '@defaults scroll-snap-type': {},
                  'scroll-snap-type': 'y var(--tw-scroll-snap-strictness)',
                },
                '.snap-both': {
                  '@defaults scroll-snap-type': {},
                  'scroll-snap-type': 'both var(--tw-scroll-snap-strictness)',
                },
                '.snap-mandatory': {
                  '--tw-scroll-snap-strictness': 'mandatory',
                },
                '.snap-proximity': {
                  '--tw-scroll-snap-strictness': 'proximity',
                },
              });
          },
          scrollSnapAlign: ({ addUtilities: r }) => {
            r({
              '.snap-start': { 'scroll-snap-align': 'start' },
              '.snap-end': { 'scroll-snap-align': 'end' },
              '.snap-center': { 'scroll-snap-align': 'center' },
              '.snap-align-none': { 'scroll-snap-align': 'none' },
            });
          },
          scrollSnapStop: ({ addUtilities: r }) => {
            r({
              '.snap-normal': { 'scroll-snap-stop': 'normal' },
              '.snap-always': { 'scroll-snap-stop': 'always' },
            });
          },
          scrollMargin: T(
            'scrollMargin',
            [
              ['scroll-m', ['scroll-margin']],
              [
                ['scroll-mx', ['scroll-margin-left', 'scroll-margin-right']],
                ['scroll-my', ['scroll-margin-top', 'scroll-margin-bottom']],
              ],
              [
                ['scroll-ms', ['scroll-margin-inline-start']],
                ['scroll-me', ['scroll-margin-inline-end']],
                ['scroll-mt', ['scroll-margin-top']],
                ['scroll-mr', ['scroll-margin-right']],
                ['scroll-mb', ['scroll-margin-bottom']],
                ['scroll-ml', ['scroll-margin-left']],
              ],
            ],
            { supportsNegativeValues: !0 }
          ),
          scrollPadding: T('scrollPadding', [
            ['scroll-p', ['scroll-padding']],
            [
              ['scroll-px', ['scroll-padding-left', 'scroll-padding-right']],
              ['scroll-py', ['scroll-padding-top', 'scroll-padding-bottom']],
            ],
            [
              ['scroll-ps', ['scroll-padding-inline-start']],
              ['scroll-pe', ['scroll-padding-inline-end']],
              ['scroll-pt', ['scroll-padding-top']],
              ['scroll-pr', ['scroll-padding-right']],
              ['scroll-pb', ['scroll-padding-bottom']],
              ['scroll-pl', ['scroll-padding-left']],
            ],
          ]),
          listStylePosition: ({ addUtilities: r }) => {
            r({
              '.list-inside': { 'list-style-position': 'inside' },
              '.list-outside': { 'list-style-position': 'outside' },
            });
          },
          listStyleType: T('listStyleType', [['list', ['listStyleType']]]),
          listStyleImage: T('listStyleImage', [
            ['list-image', ['listStyleImage']],
          ]),
          appearance: ({ addUtilities: r }) => {
            r({ '.appearance-none': { appearance: 'none' } });
          },
          columns: T('columns', [['columns', ['columns']]]),
          breakBefore: ({ addUtilities: r }) => {
            r({
              '.break-before-auto': { 'break-before': 'auto' },
              '.break-before-avoid': { 'break-before': 'avoid' },
              '.break-before-all': { 'break-before': 'all' },
              '.break-before-avoid-page': { 'break-before': 'avoid-page' },
              '.break-before-page': { 'break-before': 'page' },
              '.break-before-left': { 'break-before': 'left' },
              '.break-before-right': { 'break-before': 'right' },
              '.break-before-column': { 'break-before': 'column' },
            });
          },
          breakInside: ({ addUtilities: r }) => {
            r({
              '.break-inside-auto': { 'break-inside': 'auto' },
              '.break-inside-avoid': { 'break-inside': 'avoid' },
              '.break-inside-avoid-page': { 'break-inside': 'avoid-page' },
              '.break-inside-avoid-column': { 'break-inside': 'avoid-column' },
            });
          },
          breakAfter: ({ addUtilities: r }) => {
            r({
              '.break-after-auto': { 'break-after': 'auto' },
              '.break-after-avoid': { 'break-after': 'avoid' },
              '.break-after-all': { 'break-after': 'all' },
              '.break-after-avoid-page': { 'break-after': 'avoid-page' },
              '.break-after-page': { 'break-after': 'page' },
              '.break-after-left': { 'break-after': 'left' },
              '.break-after-right': { 'break-after': 'right' },
              '.break-after-column': { 'break-after': 'column' },
            });
          },
          gridAutoColumns: T('gridAutoColumns', [
            ['auto-cols', ['gridAutoColumns']],
          ]),
          gridAutoFlow: ({ addUtilities: r }) => {
            r({
              '.grid-flow-row': { gridAutoFlow: 'row' },
              '.grid-flow-col': { gridAutoFlow: 'column' },
              '.grid-flow-dense': { gridAutoFlow: 'dense' },
              '.grid-flow-row-dense': { gridAutoFlow: 'row dense' },
              '.grid-flow-col-dense': { gridAutoFlow: 'column dense' },
            });
          },
          gridAutoRows: T('gridAutoRows', [['auto-rows', ['gridAutoRows']]]),
          gridTemplateColumns: T('gridTemplateColumns', [
            ['grid-cols', ['gridTemplateColumns']],
          ]),
          gridTemplateRows: T('gridTemplateRows', [
            ['grid-rows', ['gridTemplateRows']],
          ]),
          flexDirection: ({ addUtilities: r }) => {
            r({
              '.flex-row': { 'flex-direction': 'row' },
              '.flex-row-reverse': { 'flex-direction': 'row-reverse' },
              '.flex-col': { 'flex-direction': 'column' },
              '.flex-col-reverse': { 'flex-direction': 'column-reverse' },
            });
          },
          flexWrap: ({ addUtilities: r }) => {
            r({
              '.flex-wrap': { 'flex-wrap': 'wrap' },
              '.flex-wrap-reverse': { 'flex-wrap': 'wrap-reverse' },
              '.flex-nowrap': { 'flex-wrap': 'nowrap' },
            });
          },
          placeContent: ({ addUtilities: r }) => {
            r({
              '.place-content-center': { 'place-content': 'center' },
              '.place-content-start': { 'place-content': 'start' },
              '.place-content-end': { 'place-content': 'end' },
              '.place-content-between': { 'place-content': 'space-between' },
              '.place-content-around': { 'place-content': 'space-around' },
              '.place-content-evenly': { 'place-content': 'space-evenly' },
              '.place-content-baseline': { 'place-content': 'baseline' },
              '.place-content-stretch': { 'place-content': 'stretch' },
            });
          },
          placeItems: ({ addUtilities: r }) => {
            r({
              '.place-items-start': { 'place-items': 'start' },
              '.place-items-end': { 'place-items': 'end' },
              '.place-items-center': { 'place-items': 'center' },
              '.place-items-baseline': { 'place-items': 'baseline' },
              '.place-items-stretch': { 'place-items': 'stretch' },
            });
          },
          alignContent: ({ addUtilities: r }) => {
            r({
              '.content-normal': { 'align-content': 'normal' },
              '.content-center': { 'align-content': 'center' },
              '.content-start': { 'align-content': 'flex-start' },
              '.content-end': { 'align-content': 'flex-end' },
              '.content-between': { 'align-content': 'space-between' },
              '.content-around': { 'align-content': 'space-around' },
              '.content-evenly': { 'align-content': 'space-evenly' },
              '.content-baseline': { 'align-content': 'baseline' },
              '.content-stretch': { 'align-content': 'stretch' },
            });
          },
          alignItems: ({ addUtilities: r }) => {
            r({
              '.items-start': { 'align-items': 'flex-start' },
              '.items-end': { 'align-items': 'flex-end' },
              '.items-center': { 'align-items': 'center' },
              '.items-baseline': { 'align-items': 'baseline' },
              '.items-stretch': { 'align-items': 'stretch' },
            });
          },
          justifyContent: ({ addUtilities: r }) => {
            r({
              '.justify-normal': { 'justify-content': 'normal' },
              '.justify-start': { 'justify-content': 'flex-start' },
              '.justify-end': { 'justify-content': 'flex-end' },
              '.justify-center': { 'justify-content': 'center' },
              '.justify-between': { 'justify-content': 'space-between' },
              '.justify-around': { 'justify-content': 'space-around' },
              '.justify-evenly': { 'justify-content': 'space-evenly' },
              '.justify-stretch': { 'justify-content': 'stretch' },
            });
          },
          justifyItems: ({ addUtilities: r }) => {
            r({
              '.justify-items-start': { 'justify-items': 'start' },
              '.justify-items-end': { 'justify-items': 'end' },
              '.justify-items-center': { 'justify-items': 'center' },
              '.justify-items-stretch': { 'justify-items': 'stretch' },
            });
          },
          gap: T('gap', [
            ['gap', ['gap']],
            [
              ['gap-x', ['columnGap']],
              ['gap-y', ['rowGap']],
            ],
          ]),
          space: ({ matchUtilities: r, addUtilities: e, theme: t }) => {
            r(
              {
                'space-x': (i) => (
                  (i = i === '0' ? '0px' : i),
                  {
                    '& > :not([hidden]) ~ :not([hidden])': {
                      '--tw-space-x-reverse': '0',
                      'margin-right': `calc(${i} * var(--tw-space-x-reverse))`,
                      'margin-left': `calc(${i} * calc(1 - var(--tw-space-x-reverse)))`,
                    },
                  }
                ),
                'space-y': (i) => (
                  (i = i === '0' ? '0px' : i),
                  {
                    '& > :not([hidden]) ~ :not([hidden])': {
                      '--tw-space-y-reverse': '0',
                      'margin-top': `calc(${i} * calc(1 - var(--tw-space-y-reverse)))`,
                      'margin-bottom': `calc(${i} * var(--tw-space-y-reverse))`,
                    },
                  }
                ),
              },
              { values: t('space'), supportsNegativeValues: !0 }
            ),
              e({
                '.space-y-reverse > :not([hidden]) ~ :not([hidden])': {
                  '--tw-space-y-reverse': '1',
                },
                '.space-x-reverse > :not([hidden]) ~ :not([hidden])': {
                  '--tw-space-x-reverse': '1',
                },
              });
          },
          divideWidth: ({ matchUtilities: r, addUtilities: e, theme: t }) => {
            r(
              {
                'divide-x': (i) => (
                  (i = i === '0' ? '0px' : i),
                  {
                    '& > :not([hidden]) ~ :not([hidden])': {
                      '@defaults border-width': {},
                      '--tw-divide-x-reverse': '0',
                      'border-right-width': `calc(${i} * var(--tw-divide-x-reverse))`,
                      'border-left-width': `calc(${i} * calc(1 - var(--tw-divide-x-reverse)))`,
                    },
                  }
                ),
                'divide-y': (i) => (
                  (i = i === '0' ? '0px' : i),
                  {
                    '& > :not([hidden]) ~ :not([hidden])': {
                      '@defaults border-width': {},
                      '--tw-divide-y-reverse': '0',
                      'border-top-width': `calc(${i} * calc(1 - var(--tw-divide-y-reverse)))`,
                      'border-bottom-width': `calc(${i} * var(--tw-divide-y-reverse))`,
                    },
                  }
                ),
              },
              {
                values: t('divideWidth'),
                type: ['line-width', 'length', 'any'],
              }
            ),
              e({
                '.divide-y-reverse > :not([hidden]) ~ :not([hidden])': {
                  '@defaults border-width': {},
                  '--tw-divide-y-reverse': '1',
                },
                '.divide-x-reverse > :not([hidden]) ~ :not([hidden])': {
                  '@defaults border-width': {},
                  '--tw-divide-x-reverse': '1',
                },
              });
          },
          divideStyle: ({ addUtilities: r }) => {
            r({
              '.divide-solid > :not([hidden]) ~ :not([hidden])': {
                'border-style': 'solid',
              },
              '.divide-dashed > :not([hidden]) ~ :not([hidden])': {
                'border-style': 'dashed',
              },
              '.divide-dotted > :not([hidden]) ~ :not([hidden])': {
                'border-style': 'dotted',
              },
              '.divide-double > :not([hidden]) ~ :not([hidden])': {
                'border-style': 'double',
              },
              '.divide-none > :not([hidden]) ~ :not([hidden])': {
                'border-style': 'none',
              },
            });
          },
          divideColor: ({ matchUtilities: r, theme: e, corePlugins: t }) => {
            r(
              {
                divide: (i) =>
                  t('divideOpacity')
                    ? {
                        ['& > :not([hidden]) ~ :not([hidden])']: oe({
                          color: i,
                          property: 'border-color',
                          variable: '--tw-divide-opacity',
                        }),
                      }
                    : {
                        ['& > :not([hidden]) ~ :not([hidden])']: {
                          'border-color': L(i),
                        },
                      },
              },
              {
                values: (({ DEFAULT: i, ...n }) => n)(ne(e('divideColor'))),
                type: ['color', 'any'],
              }
            );
          },
          divideOpacity: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'divide-opacity': (t) => ({
                  ['& > :not([hidden]) ~ :not([hidden])']: {
                    '--tw-divide-opacity': t,
                  },
                }),
              },
              { values: e('divideOpacity') }
            );
          },
          placeSelf: ({ addUtilities: r }) => {
            r({
              '.place-self-auto': { 'place-self': 'auto' },
              '.place-self-start': { 'place-self': 'start' },
              '.place-self-end': { 'place-self': 'end' },
              '.place-self-center': { 'place-self': 'center' },
              '.place-self-stretch': { 'place-self': 'stretch' },
            });
          },
          alignSelf: ({ addUtilities: r }) => {
            r({
              '.self-auto': { 'align-self': 'auto' },
              '.self-start': { 'align-self': 'flex-start' },
              '.self-end': { 'align-self': 'flex-end' },
              '.self-center': { 'align-self': 'center' },
              '.self-stretch': { 'align-self': 'stretch' },
              '.self-baseline': { 'align-self': 'baseline' },
            });
          },
          justifySelf: ({ addUtilities: r }) => {
            r({
              '.justify-self-auto': { 'justify-self': 'auto' },
              '.justify-self-start': { 'justify-self': 'start' },
              '.justify-self-end': { 'justify-self': 'end' },
              '.justify-self-center': { 'justify-self': 'center' },
              '.justify-self-stretch': { 'justify-self': 'stretch' },
            });
          },
          overflow: ({ addUtilities: r }) => {
            r({
              '.overflow-auto': { overflow: 'auto' },
              '.overflow-hidden': { overflow: 'hidden' },
              '.overflow-clip': { overflow: 'clip' },
              '.overflow-visible': { overflow: 'visible' },
              '.overflow-scroll': { overflow: 'scroll' },
              '.overflow-x-auto': { 'overflow-x': 'auto' },
              '.overflow-y-auto': { 'overflow-y': 'auto' },
              '.overflow-x-hidden': { 'overflow-x': 'hidden' },
              '.overflow-y-hidden': { 'overflow-y': 'hidden' },
              '.overflow-x-clip': { 'overflow-x': 'clip' },
              '.overflow-y-clip': { 'overflow-y': 'clip' },
              '.overflow-x-visible': { 'overflow-x': 'visible' },
              '.overflow-y-visible': { 'overflow-y': 'visible' },
              '.overflow-x-scroll': { 'overflow-x': 'scroll' },
              '.overflow-y-scroll': { 'overflow-y': 'scroll' },
            });
          },
          overscrollBehavior: ({ addUtilities: r }) => {
            r({
              '.overscroll-auto': { 'overscroll-behavior': 'auto' },
              '.overscroll-contain': { 'overscroll-behavior': 'contain' },
              '.overscroll-none': { 'overscroll-behavior': 'none' },
              '.overscroll-y-auto': { 'overscroll-behavior-y': 'auto' },
              '.overscroll-y-contain': { 'overscroll-behavior-y': 'contain' },
              '.overscroll-y-none': { 'overscroll-behavior-y': 'none' },
              '.overscroll-x-auto': { 'overscroll-behavior-x': 'auto' },
              '.overscroll-x-contain': { 'overscroll-behavior-x': 'contain' },
              '.overscroll-x-none': { 'overscroll-behavior-x': 'none' },
            });
          },
          scrollBehavior: ({ addUtilities: r }) => {
            r({
              '.scroll-auto': { 'scroll-behavior': 'auto' },
              '.scroll-smooth': { 'scroll-behavior': 'smooth' },
            });
          },
          textOverflow: ({ addUtilities: r }) => {
            r({
              '.truncate': {
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap',
              },
              '.overflow-ellipsis': { 'text-overflow': 'ellipsis' },
              '.text-ellipsis': { 'text-overflow': 'ellipsis' },
              '.text-clip': { 'text-overflow': 'clip' },
            });
          },
          hyphens: ({ addUtilities: r }) => {
            r({
              '.hyphens-none': { hyphens: 'none' },
              '.hyphens-manual': { hyphens: 'manual' },
              '.hyphens-auto': { hyphens: 'auto' },
            });
          },
          whitespace: ({ addUtilities: r }) => {
            r({
              '.whitespace-normal': { 'white-space': 'normal' },
              '.whitespace-nowrap': { 'white-space': 'nowrap' },
              '.whitespace-pre': { 'white-space': 'pre' },
              '.whitespace-pre-line': { 'white-space': 'pre-line' },
              '.whitespace-pre-wrap': { 'white-space': 'pre-wrap' },
              '.whitespace-break-spaces': { 'white-space': 'break-spaces' },
            });
          },
          wordBreak: ({ addUtilities: r }) => {
            r({
              '.break-normal': {
                'overflow-wrap': 'normal',
                'word-break': 'normal',
              },
              '.break-words': { 'overflow-wrap': 'break-word' },
              '.break-all': { 'word-break': 'break-all' },
              '.break-keep': { 'word-break': 'keep-all' },
            });
          },
          borderRadius: T('borderRadius', [
            ['rounded', ['border-radius']],
            [
              [
                'rounded-s',
                ['border-start-start-radius', 'border-end-start-radius'],
              ],
              [
                'rounded-e',
                ['border-start-end-radius', 'border-end-end-radius'],
              ],
              [
                'rounded-t',
                ['border-top-left-radius', 'border-top-right-radius'],
              ],
              [
                'rounded-r',
                ['border-top-right-radius', 'border-bottom-right-radius'],
              ],
              [
                'rounded-b',
                ['border-bottom-right-radius', 'border-bottom-left-radius'],
              ],
              [
                'rounded-l',
                ['border-top-left-radius', 'border-bottom-left-radius'],
              ],
            ],
            [
              ['rounded-ss', ['border-start-start-radius']],
              ['rounded-se', ['border-start-end-radius']],
              ['rounded-ee', ['border-end-end-radius']],
              ['rounded-es', ['border-end-start-radius']],
              ['rounded-tl', ['border-top-left-radius']],
              ['rounded-tr', ['border-top-right-radius']],
              ['rounded-br', ['border-bottom-right-radius']],
              ['rounded-bl', ['border-bottom-left-radius']],
            ],
          ]),
          borderWidth: T(
            'borderWidth',
            [
              ['border', [['@defaults border-width', {}], 'border-width']],
              [
                [
                  'border-x',
                  [
                    ['@defaults border-width', {}],
                    'border-left-width',
                    'border-right-width',
                  ],
                ],
                [
                  'border-y',
                  [
                    ['@defaults border-width', {}],
                    'border-top-width',
                    'border-bottom-width',
                  ],
                ],
              ],
              [
                [
                  'border-s',
                  [['@defaults border-width', {}], 'border-inline-start-width'],
                ],
                [
                  'border-e',
                  [['@defaults border-width', {}], 'border-inline-end-width'],
                ],
                [
                  'border-t',
                  [['@defaults border-width', {}], 'border-top-width'],
                ],
                [
                  'border-r',
                  [['@defaults border-width', {}], 'border-right-width'],
                ],
                [
                  'border-b',
                  [['@defaults border-width', {}], 'border-bottom-width'],
                ],
                [
                  'border-l',
                  [['@defaults border-width', {}], 'border-left-width'],
                ],
              ],
            ],
            { type: ['line-width', 'length'] }
          ),
          borderStyle: ({ addUtilities: r }) => {
            r({
              '.border-solid': { 'border-style': 'solid' },
              '.border-dashed': { 'border-style': 'dashed' },
              '.border-dotted': { 'border-style': 'dotted' },
              '.border-double': { 'border-style': 'double' },
              '.border-hidden': { 'border-style': 'hidden' },
              '.border-none': { 'border-style': 'none' },
            });
          },
          borderColor: ({ matchUtilities: r, theme: e, corePlugins: t }) => {
            r(
              {
                border: (i) =>
                  t('borderOpacity')
                    ? oe({
                        color: i,
                        property: 'border-color',
                        variable: '--tw-border-opacity',
                      })
                    : { 'border-color': L(i) },
              },
              {
                values: (({ DEFAULT: i, ...n }) => n)(ne(e('borderColor'))),
                type: ['color', 'any'],
              }
            ),
              r(
                {
                  'border-x': (i) =>
                    t('borderOpacity')
                      ? oe({
                          color: i,
                          property: ['border-left-color', 'border-right-color'],
                          variable: '--tw-border-opacity',
                        })
                      : {
                          'border-left-color': L(i),
                          'border-right-color': L(i),
                        },
                  'border-y': (i) =>
                    t('borderOpacity')
                      ? oe({
                          color: i,
                          property: ['border-top-color', 'border-bottom-color'],
                          variable: '--tw-border-opacity',
                        })
                      : {
                          'border-top-color': L(i),
                          'border-bottom-color': L(i),
                        },
                },
                {
                  values: (({ DEFAULT: i, ...n }) => n)(ne(e('borderColor'))),
                  type: ['color', 'any'],
                }
              ),
              r(
                {
                  'border-s': (i) =>
                    t('borderOpacity')
                      ? oe({
                          color: i,
                          property: 'border-inline-start-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-inline-start-color': L(i) },
                  'border-e': (i) =>
                    t('borderOpacity')
                      ? oe({
                          color: i,
                          property: 'border-inline-end-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-inline-end-color': L(i) },
                  'border-t': (i) =>
                    t('borderOpacity')
                      ? oe({
                          color: i,
                          property: 'border-top-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-top-color': L(i) },
                  'border-r': (i) =>
                    t('borderOpacity')
                      ? oe({
                          color: i,
                          property: 'border-right-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-right-color': L(i) },
                  'border-b': (i) =>
                    t('borderOpacity')
                      ? oe({
                          color: i,
                          property: 'border-bottom-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-bottom-color': L(i) },
                  'border-l': (i) =>
                    t('borderOpacity')
                      ? oe({
                          color: i,
                          property: 'border-left-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-left-color': L(i) },
                },
                {
                  values: (({ DEFAULT: i, ...n }) => n)(ne(e('borderColor'))),
                  type: ['color', 'any'],
                }
              );
          },
          borderOpacity: T('borderOpacity', [
            ['border-opacity', ['--tw-border-opacity']],
          ]),
          backgroundColor: ({
            matchUtilities: r,
            theme: e,
            corePlugins: t,
          }) => {
            r(
              {
                bg: (i) =>
                  t('backgroundOpacity')
                    ? oe({
                        color: i,
                        property: 'background-color',
                        variable: '--tw-bg-opacity',
                      })
                    : { 'background-color': L(i) },
              },
              { values: ne(e('backgroundColor')), type: ['color', 'any'] }
            );
          },
          backgroundOpacity: T('backgroundOpacity', [
            ['bg-opacity', ['--tw-bg-opacity']],
          ]),
          backgroundImage: T(
            'backgroundImage',
            [['bg', ['background-image']]],
            { type: ['lookup', 'image', 'url'] }
          ),
          gradientColorStops: (() => {
            function r(e) {
              return Ie(e, 0, 'rgb(255 255 255 / 0)');
            }
            return function ({ matchUtilities: e, theme: t, addDefaults: i }) {
              i('gradient-color-stops', {
                '--tw-gradient-from-position': ' ',
                '--tw-gradient-via-position': ' ',
                '--tw-gradient-to-position': ' ',
              });
              let n = {
                  values: ne(t('gradientColorStops')),
                  type: ['color', 'any'],
                },
                s = {
                  values: t('gradientColorStopPositions'),
                  type: ['length', 'percentage'],
                };
              e(
                {
                  from: (a) => {
                    let o = r(a);
                    return {
                      '@defaults gradient-color-stops': {},
                      '--tw-gradient-from': `${L(
                        a
                      )} var(--tw-gradient-from-position)`,
                      '--tw-gradient-to': `${o} var(--tw-gradient-to-position)`,
                      '--tw-gradient-stops':
                        'var(--tw-gradient-from), var(--tw-gradient-to)',
                    };
                  },
                },
                n
              ),
                e({ from: (a) => ({ '--tw-gradient-from-position': a }) }, s),
                e(
                  {
                    via: (a) => {
                      let o = r(a);
                      return {
                        '@defaults gradient-color-stops': {},
                        '--tw-gradient-to': `${o}  var(--tw-gradient-to-position)`,
                        '--tw-gradient-stops': `var(--tw-gradient-from), ${L(
                          a
                        )} var(--tw-gradient-via-position), var(--tw-gradient-to)`,
                      };
                    },
                  },
                  n
                ),
                e({ via: (a) => ({ '--tw-gradient-via-position': a }) }, s),
                e(
                  {
                    to: (a) => ({
                      '@defaults gradient-color-stops': {},
                      '--tw-gradient-to': `${L(
                        a
                      )} var(--tw-gradient-to-position)`,
                    }),
                  },
                  n
                ),
                e({ to: (a) => ({ '--tw-gradient-to-position': a }) }, s);
            };
          })(),
          boxDecorationBreak: ({ addUtilities: r }) => {
            r({
              '.decoration-slice': { 'box-decoration-break': 'slice' },
              '.decoration-clone': { 'box-decoration-break': 'clone' },
              '.box-decoration-slice': { 'box-decoration-break': 'slice' },
              '.box-decoration-clone': { 'box-decoration-break': 'clone' },
            });
          },
          backgroundSize: T('backgroundSize', [['bg', ['background-size']]], {
            type: ['lookup', 'length', 'percentage', 'size'],
          }),
          backgroundAttachment: ({ addUtilities: r }) => {
            r({
              '.bg-fixed': { 'background-attachment': 'fixed' },
              '.bg-local': { 'background-attachment': 'local' },
              '.bg-scroll': { 'background-attachment': 'scroll' },
            });
          },
          backgroundClip: ({ addUtilities: r }) => {
            r({
              '.bg-clip-border': { 'background-clip': 'border-box' },
              '.bg-clip-padding': { 'background-clip': 'padding-box' },
              '.bg-clip-content': { 'background-clip': 'content-box' },
              '.bg-clip-text': { 'background-clip': 'text' },
            });
          },
          backgroundPosition: T(
            'backgroundPosition',
            [['bg', ['background-position']]],
            { type: ['lookup', ['position', { preferOnConflict: !0 }]] }
          ),
          backgroundRepeat: ({ addUtilities: r }) => {
            r({
              '.bg-repeat': { 'background-repeat': 'repeat' },
              '.bg-no-repeat': { 'background-repeat': 'no-repeat' },
              '.bg-repeat-x': { 'background-repeat': 'repeat-x' },
              '.bg-repeat-y': { 'background-repeat': 'repeat-y' },
              '.bg-repeat-round': { 'background-repeat': 'round' },
              '.bg-repeat-space': { 'background-repeat': 'space' },
            });
          },
          backgroundOrigin: ({ addUtilities: r }) => {
            r({
              '.bg-origin-border': { 'background-origin': 'border-box' },
              '.bg-origin-padding': { 'background-origin': 'padding-box' },
              '.bg-origin-content': { 'background-origin': 'content-box' },
            });
          },
          fill: ({ matchUtilities: r, theme: e }) => {
            r(
              { fill: (t) => ({ fill: L(t) }) },
              { values: ne(e('fill')), type: ['color', 'any'] }
            );
          },
          stroke: ({ matchUtilities: r, theme: e }) => {
            r(
              { stroke: (t) => ({ stroke: L(t) }) },
              { values: ne(e('stroke')), type: ['color', 'url', 'any'] }
            );
          },
          strokeWidth: T('strokeWidth', [['stroke', ['stroke-width']]], {
            type: ['length', 'number', 'percentage'],
          }),
          objectFit: ({ addUtilities: r }) => {
            r({
              '.object-contain': { 'object-fit': 'contain' },
              '.object-cover': { 'object-fit': 'cover' },
              '.object-fill': { 'object-fit': 'fill' },
              '.object-none': { 'object-fit': 'none' },
              '.object-scale-down': { 'object-fit': 'scale-down' },
            });
          },
          objectPosition: T('objectPosition', [
            ['object', ['object-position']],
          ]),
          padding: T('padding', [
            ['p', ['padding']],
            [
              ['px', ['padding-left', 'padding-right']],
              ['py', ['padding-top', 'padding-bottom']],
            ],
            [
              ['ps', ['padding-inline-start']],
              ['pe', ['padding-inline-end']],
              ['pt', ['padding-top']],
              ['pr', ['padding-right']],
              ['pb', ['padding-bottom']],
              ['pl', ['padding-left']],
            ],
          ]),
          textAlign: ({ addUtilities: r }) => {
            r({
              '.text-left': { 'text-align': 'left' },
              '.text-center': { 'text-align': 'center' },
              '.text-right': { 'text-align': 'right' },
              '.text-justify': { 'text-align': 'justify' },
              '.text-start': { 'text-align': 'start' },
              '.text-end': { 'text-align': 'end' },
            });
          },
          textIndent: T('textIndent', [['indent', ['text-indent']]], {
            supportsNegativeValues: !0,
          }),
          verticalAlign: ({ addUtilities: r, matchUtilities: e }) => {
            r({
              '.align-baseline': { 'vertical-align': 'baseline' },
              '.align-top': { 'vertical-align': 'top' },
              '.align-middle': { 'vertical-align': 'middle' },
              '.align-bottom': { 'vertical-align': 'bottom' },
              '.align-text-top': { 'vertical-align': 'text-top' },
              '.align-text-bottom': { 'vertical-align': 'text-bottom' },
              '.align-sub': { 'vertical-align': 'sub' },
              '.align-super': { 'vertical-align': 'super' },
            }),
              e({ align: (t) => ({ 'vertical-align': t }) });
          },
          fontFamily: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                font: (t) => {
                  let [i, n = {}] = Array.isArray(t) && se(t[1]) ? t : [t],
                    { fontFeatureSettings: s, fontVariationSettings: a } = n;
                  return {
                    'font-family': Array.isArray(i) ? i.join(', ') : i,
                    ...(s === void 0 ? {} : { 'font-feature-settings': s }),
                    ...(a === void 0 ? {} : { 'font-variation-settings': a }),
                  };
                },
              },
              {
                values: e('fontFamily'),
                type: ['lookup', 'generic-name', 'family-name'],
              }
            );
          },
          fontSize: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                text: (t, { modifier: i }) => {
                  let [n, s] = Array.isArray(t) ? t : [t];
                  if (i) return { 'font-size': n, 'line-height': i };
                  let {
                    lineHeight: a,
                    letterSpacing: o,
                    fontWeight: u,
                  } = se(s) ? s : { lineHeight: s };
                  return {
                    'font-size': n,
                    ...(a === void 0 ? {} : { 'line-height': a }),
                    ...(o === void 0 ? {} : { 'letter-spacing': o }),
                    ...(u === void 0 ? {} : { 'font-weight': u }),
                  };
                },
              },
              {
                values: e('fontSize'),
                modifiers: e('lineHeight'),
                type: [
                  'absolute-size',
                  'relative-size',
                  'length',
                  'percentage',
                ],
              }
            );
          },
          fontWeight: T('fontWeight', [['font', ['fontWeight']]], {
            type: ['lookup', 'number', 'any'],
          }),
          textTransform: ({ addUtilities: r }) => {
            r({
              '.uppercase': { 'text-transform': 'uppercase' },
              '.lowercase': { 'text-transform': 'lowercase' },
              '.capitalize': { 'text-transform': 'capitalize' },
              '.normal-case': { 'text-transform': 'none' },
            });
          },
          fontStyle: ({ addUtilities: r }) => {
            r({
              '.italic': { 'font-style': 'italic' },
              '.not-italic': { 'font-style': 'normal' },
            });
          },
          fontVariantNumeric: ({ addDefaults: r, addUtilities: e }) => {
            let t =
              'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)';
            r('font-variant-numeric', {
              '--tw-ordinal': ' ',
              '--tw-slashed-zero': ' ',
              '--tw-numeric-figure': ' ',
              '--tw-numeric-spacing': ' ',
              '--tw-numeric-fraction': ' ',
            }),
              e({
                '.normal-nums': { 'font-variant-numeric': 'normal' },
                '.ordinal': {
                  '@defaults font-variant-numeric': {},
                  '--tw-ordinal': 'ordinal',
                  'font-variant-numeric': t,
                },
                '.slashed-zero': {
                  '@defaults font-variant-numeric': {},
                  '--tw-slashed-zero': 'slashed-zero',
                  'font-variant-numeric': t,
                },
                '.lining-nums': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-figure': 'lining-nums',
                  'font-variant-numeric': t,
                },
                '.oldstyle-nums': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-figure': 'oldstyle-nums',
                  'font-variant-numeric': t,
                },
                '.proportional-nums': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-spacing': 'proportional-nums',
                  'font-variant-numeric': t,
                },
                '.tabular-nums': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-spacing': 'tabular-nums',
                  'font-variant-numeric': t,
                },
                '.diagonal-fractions': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-fraction': 'diagonal-fractions',
                  'font-variant-numeric': t,
                },
                '.stacked-fractions': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-fraction': 'stacked-fractions',
                  'font-variant-numeric': t,
                },
              });
          },
          lineHeight: T('lineHeight', [['leading', ['lineHeight']]]),
          letterSpacing: T('letterSpacing', [['tracking', ['letterSpacing']]], {
            supportsNegativeValues: !0,
          }),
          textColor: ({ matchUtilities: r, theme: e, corePlugins: t }) => {
            r(
              {
                text: (i) =>
                  t('textOpacity')
                    ? oe({
                        color: i,
                        property: 'color',
                        variable: '--tw-text-opacity',
                      })
                    : { color: L(i) },
              },
              { values: ne(e('textColor')), type: ['color', 'any'] }
            );
          },
          textOpacity: T('textOpacity', [
            ['text-opacity', ['--tw-text-opacity']],
          ]),
          textDecoration: ({ addUtilities: r }) => {
            r({
              '.underline': { 'text-decoration-line': 'underline' },
              '.overline': { 'text-decoration-line': 'overline' },
              '.line-through': { 'text-decoration-line': 'line-through' },
              '.no-underline': { 'text-decoration-line': 'none' },
            });
          },
          textDecorationColor: ({ matchUtilities: r, theme: e }) => {
            r(
              { decoration: (t) => ({ 'text-decoration-color': L(t) }) },
              { values: ne(e('textDecorationColor')), type: ['color', 'any'] }
            );
          },
          textDecorationStyle: ({ addUtilities: r }) => {
            r({
              '.decoration-solid': { 'text-decoration-style': 'solid' },
              '.decoration-double': { 'text-decoration-style': 'double' },
              '.decoration-dotted': { 'text-decoration-style': 'dotted' },
              '.decoration-dashed': { 'text-decoration-style': 'dashed' },
              '.decoration-wavy': { 'text-decoration-style': 'wavy' },
            });
          },
          textDecorationThickness: T(
            'textDecorationThickness',
            [['decoration', ['text-decoration-thickness']]],
            { type: ['length', 'percentage'] }
          ),
          textUnderlineOffset: T(
            'textUnderlineOffset',
            [['underline-offset', ['text-underline-offset']]],
            { type: ['length', 'percentage', 'any'] }
          ),
          fontSmoothing: ({ addUtilities: r }) => {
            r({
              '.antialiased': {
                '-webkit-font-smoothing': 'antialiased',
                '-moz-osx-font-smoothing': 'grayscale',
              },
              '.subpixel-antialiased': {
                '-webkit-font-smoothing': 'auto',
                '-moz-osx-font-smoothing': 'auto',
              },
            });
          },
          placeholderColor: ({
            matchUtilities: r,
            theme: e,
            corePlugins: t,
          }) => {
            r(
              {
                placeholder: (i) =>
                  t('placeholderOpacity')
                    ? {
                        '&::placeholder': oe({
                          color: i,
                          property: 'color',
                          variable: '--tw-placeholder-opacity',
                        }),
                      }
                    : { '&::placeholder': { color: L(i) } },
              },
              { values: ne(e('placeholderColor')), type: ['color', 'any'] }
            );
          },
          placeholderOpacity: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'placeholder-opacity': (t) => ({
                  ['&::placeholder']: { '--tw-placeholder-opacity': t },
                }),
              },
              { values: e('placeholderOpacity') }
            );
          },
          caretColor: ({ matchUtilities: r, theme: e }) => {
            r(
              { caret: (t) => ({ 'caret-color': L(t) }) },
              { values: ne(e('caretColor')), type: ['color', 'any'] }
            );
          },
          accentColor: ({ matchUtilities: r, theme: e }) => {
            r(
              { accent: (t) => ({ 'accent-color': L(t) }) },
              { values: ne(e('accentColor')), type: ['color', 'any'] }
            );
          },
          opacity: T('opacity', [['opacity', ['opacity']]]),
          backgroundBlendMode: ({ addUtilities: r }) => {
            r({
              '.bg-blend-normal': { 'background-blend-mode': 'normal' },
              '.bg-blend-multiply': { 'background-blend-mode': 'multiply' },
              '.bg-blend-screen': { 'background-blend-mode': 'screen' },
              '.bg-blend-overlay': { 'background-blend-mode': 'overlay' },
              '.bg-blend-darken': { 'background-blend-mode': 'darken' },
              '.bg-blend-lighten': { 'background-blend-mode': 'lighten' },
              '.bg-blend-color-dodge': {
                'background-blend-mode': 'color-dodge',
              },
              '.bg-blend-color-burn': { 'background-blend-mode': 'color-burn' },
              '.bg-blend-hard-light': { 'background-blend-mode': 'hard-light' },
              '.bg-blend-soft-light': { 'background-blend-mode': 'soft-light' },
              '.bg-blend-difference': { 'background-blend-mode': 'difference' },
              '.bg-blend-exclusion': { 'background-blend-mode': 'exclusion' },
              '.bg-blend-hue': { 'background-blend-mode': 'hue' },
              '.bg-blend-saturation': { 'background-blend-mode': 'saturation' },
              '.bg-blend-color': { 'background-blend-mode': 'color' },
              '.bg-blend-luminosity': { 'background-blend-mode': 'luminosity' },
            });
          },
          mixBlendMode: ({ addUtilities: r }) => {
            r({
              '.mix-blend-normal': { 'mix-blend-mode': 'normal' },
              '.mix-blend-multiply': { 'mix-blend-mode': 'multiply' },
              '.mix-blend-screen': { 'mix-blend-mode': 'screen' },
              '.mix-blend-overlay': { 'mix-blend-mode': 'overlay' },
              '.mix-blend-darken': { 'mix-blend-mode': 'darken' },
              '.mix-blend-lighten': { 'mix-blend-mode': 'lighten' },
              '.mix-blend-color-dodge': { 'mix-blend-mode': 'color-dodge' },
              '.mix-blend-color-burn': { 'mix-blend-mode': 'color-burn' },
              '.mix-blend-hard-light': { 'mix-blend-mode': 'hard-light' },
              '.mix-blend-soft-light': { 'mix-blend-mode': 'soft-light' },
              '.mix-blend-difference': { 'mix-blend-mode': 'difference' },
              '.mix-blend-exclusion': { 'mix-blend-mode': 'exclusion' },
              '.mix-blend-hue': { 'mix-blend-mode': 'hue' },
              '.mix-blend-saturation': { 'mix-blend-mode': 'saturation' },
              '.mix-blend-color': { 'mix-blend-mode': 'color' },
              '.mix-blend-luminosity': { 'mix-blend-mode': 'luminosity' },
              '.mix-blend-plus-lighter': { 'mix-blend-mode': 'plus-lighter' },
            });
          },
          boxShadow: (() => {
            let r = We('boxShadow'),
              e = [
                'var(--tw-ring-offset-shadow, 0 0 #0000)',
                'var(--tw-ring-shadow, 0 0 #0000)',
                'var(--tw-shadow)',
              ].join(', ');
            return function ({ matchUtilities: t, addDefaults: i, theme: n }) {
              i(' box-shadow', {
                '--tw-ring-offset-shadow': '0 0 #0000',
                '--tw-ring-shadow': '0 0 #0000',
                '--tw-shadow': '0 0 #0000',
                '--tw-shadow-colored': '0 0 #0000',
              }),
                t(
                  {
                    shadow: (s) => {
                      s = r(s);
                      let a = pi(s);
                      for (let o of a)
                        !o.valid || (o.color = 'var(--tw-shadow-color)');
                      return {
                        '@defaults box-shadow': {},
                        '--tw-shadow': s === 'none' ? '0 0 #0000' : s,
                        '--tw-shadow-colored':
                          s === 'none' ? '0 0 #0000' : gu(a),
                        'box-shadow': e,
                      };
                    },
                  },
                  { values: n('boxShadow'), type: ['shadow'] }
                );
            };
          })(),
          boxShadowColor: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                shadow: (t) => ({
                  '--tw-shadow-color': L(t),
                  '--tw-shadow': 'var(--tw-shadow-colored)',
                }),
              },
              { values: ne(e('boxShadowColor')), type: ['color', 'any'] }
            );
          },
          outlineStyle: ({ addUtilities: r }) => {
            r({
              '.outline-none': {
                outline: '2px solid transparent',
                'outline-offset': '2px',
              },
              '.outline': { 'outline-style': 'solid' },
              '.outline-dashed': { 'outline-style': 'dashed' },
              '.outline-dotted': { 'outline-style': 'dotted' },
              '.outline-double': { 'outline-style': 'double' },
            });
          },
          outlineWidth: T('outlineWidth', [['outline', ['outline-width']]], {
            type: ['length', 'number', 'percentage'],
          }),
          outlineOffset: T(
            'outlineOffset',
            [['outline-offset', ['outline-offset']]],
            {
              type: ['length', 'number', 'percentage', 'any'],
              supportsNegativeValues: !0,
            }
          ),
          outlineColor: ({ matchUtilities: r, theme: e }) => {
            r(
              { outline: (t) => ({ 'outline-color': L(t) }) },
              { values: ne(e('outlineColor')), type: ['color', 'any'] }
            );
          },
          ringWidth: ({
            matchUtilities: r,
            addDefaults: e,
            addUtilities: t,
            theme: i,
            config: n,
          }) => {
            let s = (() => {
              if (J(n(), 'respectDefaultRingColorOpacity'))
                return i('ringColor.DEFAULT');
              let a = i('ringOpacity.DEFAULT', '0.5');
              return i('ringColor')?.DEFAULT
                ? Ie(i('ringColor')?.DEFAULT, a, `rgb(147 197 253 / ${a})`)
                : `rgb(147 197 253 / ${a})`;
            })();
            e('ring-width', {
              '--tw-ring-inset': ' ',
              '--tw-ring-offset-width': i('ringOffsetWidth.DEFAULT', '0px'),
              '--tw-ring-offset-color': i('ringOffsetColor.DEFAULT', '#fff'),
              '--tw-ring-color': s,
              '--tw-ring-offset-shadow': '0 0 #0000',
              '--tw-ring-shadow': '0 0 #0000',
              '--tw-shadow': '0 0 #0000',
              '--tw-shadow-colored': '0 0 #0000',
            }),
              r(
                {
                  ring: (a) => ({
                    '@defaults ring-width': {},
                    '--tw-ring-offset-shadow':
                      'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
                    '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${a} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
                    'box-shadow': [
                      'var(--tw-ring-offset-shadow)',
                      'var(--tw-ring-shadow)',
                      'var(--tw-shadow, 0 0 #0000)',
                    ].join(', '),
                  }),
                },
                { values: i('ringWidth'), type: 'length' }
              ),
              t({
                '.ring-inset': {
                  '@defaults ring-width': {},
                  '--tw-ring-inset': 'inset',
                },
              });
          },
          ringColor: ({ matchUtilities: r, theme: e, corePlugins: t }) => {
            r(
              {
                ring: (i) =>
                  t('ringOpacity')
                    ? oe({
                        color: i,
                        property: '--tw-ring-color',
                        variable: '--tw-ring-opacity',
                      })
                    : { '--tw-ring-color': L(i) },
              },
              {
                values: Object.fromEntries(
                  Object.entries(ne(e('ringColor'))).filter(
                    ([i]) => i !== 'DEFAULT'
                  )
                ),
                type: ['color', 'any'],
              }
            );
          },
          ringOpacity: (r) => {
            let { config: e } = r;
            return T('ringOpacity', [['ring-opacity', ['--tw-ring-opacity']]], {
              filterDefault: !J(e(), 'respectDefaultRingColorOpacity'),
            })(r);
          },
          ringOffsetWidth: T(
            'ringOffsetWidth',
            [['ring-offset', ['--tw-ring-offset-width']]],
            { type: 'length' }
          ),
          ringOffsetColor: ({ matchUtilities: r, theme: e }) => {
            r(
              { 'ring-offset': (t) => ({ '--tw-ring-offset-color': L(t) }) },
              { values: ne(e('ringOffsetColor')), type: ['color', 'any'] }
            );
          },
          blur: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                blur: (t) => ({
                  '--tw-blur': `blur(${t})`,
                  '@defaults filter': {},
                  filter: Fe,
                }),
              },
              { values: e('blur') }
            );
          },
          brightness: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                brightness: (t) => ({
                  '--tw-brightness': `brightness(${t})`,
                  '@defaults filter': {},
                  filter: Fe,
                }),
              },
              { values: e('brightness') }
            );
          },
          contrast: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                contrast: (t) => ({
                  '--tw-contrast': `contrast(${t})`,
                  '@defaults filter': {},
                  filter: Fe,
                }),
              },
              { values: e('contrast') }
            );
          },
          dropShadow: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'drop-shadow': (t) => ({
                  '--tw-drop-shadow': Array.isArray(t)
                    ? t.map((i) => `drop-shadow(${i})`).join(' ')
                    : `drop-shadow(${t})`,
                  '@defaults filter': {},
                  filter: Fe,
                }),
              },
              { values: e('dropShadow') }
            );
          },
          grayscale: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                grayscale: (t) => ({
                  '--tw-grayscale': `grayscale(${t})`,
                  '@defaults filter': {},
                  filter: Fe,
                }),
              },
              { values: e('grayscale') }
            );
          },
          hueRotate: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'hue-rotate': (t) => ({
                  '--tw-hue-rotate': `hue-rotate(${t})`,
                  '@defaults filter': {},
                  filter: Fe,
                }),
              },
              { values: e('hueRotate'), supportsNegativeValues: !0 }
            );
          },
          invert: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                invert: (t) => ({
                  '--tw-invert': `invert(${t})`,
                  '@defaults filter': {},
                  filter: Fe,
                }),
              },
              { values: e('invert') }
            );
          },
          saturate: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                saturate: (t) => ({
                  '--tw-saturate': `saturate(${t})`,
                  '@defaults filter': {},
                  filter: Fe,
                }),
              },
              { values: e('saturate') }
            );
          },
          sepia: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                sepia: (t) => ({
                  '--tw-sepia': `sepia(${t})`,
                  '@defaults filter': {},
                  filter: Fe,
                }),
              },
              { values: e('sepia') }
            );
          },
          filter: ({ addDefaults: r, addUtilities: e }) => {
            r('filter', {
              '--tw-blur': ' ',
              '--tw-brightness': ' ',
              '--tw-contrast': ' ',
              '--tw-grayscale': ' ',
              '--tw-hue-rotate': ' ',
              '--tw-invert': ' ',
              '--tw-saturate': ' ',
              '--tw-sepia': ' ',
              '--tw-drop-shadow': ' ',
            }),
              e({
                '.filter': { '@defaults filter': {}, filter: Fe },
                '.filter-none': { filter: 'none' },
              });
          },
          backdropBlur: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'backdrop-blur': (t) => ({
                  '--tw-backdrop-blur': `blur(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Ne,
                }),
              },
              { values: e('backdropBlur') }
            );
          },
          backdropBrightness: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'backdrop-brightness': (t) => ({
                  '--tw-backdrop-brightness': `brightness(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Ne,
                }),
              },
              { values: e('backdropBrightness') }
            );
          },
          backdropContrast: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'backdrop-contrast': (t) => ({
                  '--tw-backdrop-contrast': `contrast(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Ne,
                }),
              },
              { values: e('backdropContrast') }
            );
          },
          backdropGrayscale: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'backdrop-grayscale': (t) => ({
                  '--tw-backdrop-grayscale': `grayscale(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Ne,
                }),
              },
              { values: e('backdropGrayscale') }
            );
          },
          backdropHueRotate: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'backdrop-hue-rotate': (t) => ({
                  '--tw-backdrop-hue-rotate': `hue-rotate(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Ne,
                }),
              },
              { values: e('backdropHueRotate'), supportsNegativeValues: !0 }
            );
          },
          backdropInvert: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'backdrop-invert': (t) => ({
                  '--tw-backdrop-invert': `invert(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Ne,
                }),
              },
              { values: e('backdropInvert') }
            );
          },
          backdropOpacity: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'backdrop-opacity': (t) => ({
                  '--tw-backdrop-opacity': `opacity(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Ne,
                }),
              },
              { values: e('backdropOpacity') }
            );
          },
          backdropSaturate: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'backdrop-saturate': (t) => ({
                  '--tw-backdrop-saturate': `saturate(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Ne,
                }),
              },
              { values: e('backdropSaturate') }
            );
          },
          backdropSepia: ({ matchUtilities: r, theme: e }) => {
            r(
              {
                'backdrop-sepia': (t) => ({
                  '--tw-backdrop-sepia': `sepia(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Ne,
                }),
              },
              { values: e('backdropSepia') }
            );
          },
          backdropFilter: ({ addDefaults: r, addUtilities: e }) => {
            r('backdrop-filter', {
              '--tw-backdrop-blur': ' ',
              '--tw-backdrop-brightness': ' ',
              '--tw-backdrop-contrast': ' ',
              '--tw-backdrop-grayscale': ' ',
              '--tw-backdrop-hue-rotate': ' ',
              '--tw-backdrop-invert': ' ',
              '--tw-backdrop-opacity': ' ',
              '--tw-backdrop-saturate': ' ',
              '--tw-backdrop-sepia': ' ',
            }),
              e({
                '.backdrop-filter': {
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Ne,
                },
                '.backdrop-filter-none': { 'backdrop-filter': 'none' },
              });
          },
          transitionProperty: ({ matchUtilities: r, theme: e }) => {
            let t = e('transitionTimingFunction.DEFAULT'),
              i = e('transitionDuration.DEFAULT');
            r(
              {
                transition: (n) => ({
                  'transition-property': n,
                  ...(n === 'none'
                    ? {}
                    : {
                        'transition-timing-function': t,
                        'transition-duration': i,
                      }),
                }),
              },
              { values: e('transitionProperty') }
            );
          },
          transitionDelay: T('transitionDelay', [
            ['delay', ['transitionDelay']],
          ]),
          transitionDuration: T(
            'transitionDuration',
            [['duration', ['transitionDuration']]],
            { filterDefault: !0 }
          ),
          transitionTimingFunction: T(
            'transitionTimingFunction',
            [['ease', ['transitionTimingFunction']]],
            { filterDefault: !0 }
          ),
          willChange: T('willChange', [['will-change', ['will-change']]]),
          content: T('content', [
            ['content', ['--tw-content', ['content', 'var(--tw-content)']]],
          ]),
        });
    });
  function zS(r) {
    if (r === void 0) return !1;
    if (r === 'true' || r === '1') return !0;
    if (r === 'false' || r === '0') return !1;
    if (r === '*') return !0;
    let e = r.split(',').map((t) => t.split(':')[0]);
    return e.includes('-tailwindcss') ? !1 : !!e.includes('tailwindcss');
  }
  var Pe,
    rd,
    id,
    cn,
    za,
    Ge,
    Yr,
    at = C(() => {
      l();
      Ba();
      (Pe =
        typeof m != 'undefined'
          ? {
              NODE_ENV: 'production',
              DEBUG: zS(m.env.DEBUG),
              ENGINE: ja.tailwindcss.engine,
            }
          : {
              NODE_ENV: 'production',
              DEBUG: !1,
              ENGINE: ja.tailwindcss.engine,
            }),
        (rd = new Map()),
        (id = new Map()),
        (cn = new Map()),
        (za = new Map()),
        (Ge = new String('*')),
        (Yr = Symbol('__NONE__'));
    });
  function Mt(r) {
    let e = [],
      t = !1;
    for (let i = 0; i < r.length; i++) {
      let n = r[i];
      if (n === ':' && !t && e.length === 0) return !1;
      if (
        (VS.has(n) && r[i - 1] !== '\\' && (t = !t), !t && r[i - 1] !== '\\')
      ) {
        if (nd.has(n)) e.push(n);
        else if (sd.has(n)) {
          let s = sd.get(n);
          if (e.length <= 0 || e.pop() !== s) return !1;
        }
      }
    }
    return !(e.length > 0);
  }
  var nd,
    sd,
    VS,
    Va = C(() => {
      l();
      (nd = new Map([
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ])),
        (sd = new Map(Array.from(nd.entries()).map(([r, e]) => [e, r]))),
        (VS = new Set(['"', "'", '`']));
    });
  function Ft(r) {
    let [e] = ad(r);
    return (
      e.forEach(([t, i]) => t.removeChild(i)),
      r.nodes.push(...e.map(([, t]) => t)),
      r
    );
  }
  function ad(r) {
    let e = [],
      t = null;
    for (let i of r.nodes)
      if (i.type === 'combinator')
        (e = e.filter(([, n]) => Wa(n).includes('jumpable'))), (t = null);
      else if (i.type === 'pseudo') {
        US(i)
          ? ((t = i), e.push([r, i, null]))
          : t && WS(i, t)
          ? e.push([r, i, t])
          : (t = null);
        for (let n of i.nodes ?? []) {
          let [s, a] = ad(n);
          (t = a || t), e.push(...s);
        }
      }
    return [e, t];
  }
  function od(r) {
    return r.value.startsWith('::') || Ua[r.value] !== void 0;
  }
  function US(r) {
    return od(r) && Wa(r).includes('terminal');
  }
  function WS(r, e) {
    return r.type !== 'pseudo' || od(r) ? !1 : Wa(e).includes('actionable');
  }
  function Wa(r) {
    return Ua[r.value] ?? Ua.__default__;
  }
  var Ua,
    pn = C(() => {
      l();
      Ua = {
        '::after': ['terminal', 'jumpable'],
        '::backdrop': ['terminal'],
        '::before': ['terminal', 'jumpable'],
        '::cue': ['terminal'],
        '::cue-region': ['terminal'],
        '::first-letter': ['terminal', 'jumpable'],
        '::first-line': ['terminal', 'jumpable'],
        '::grammar-error': ['terminal'],
        '::marker': ['terminal'],
        '::part': ['terminal', 'actionable'],
        '::placeholder': ['terminal'],
        '::selection': ['terminal'],
        '::slotted': ['terminal'],
        '::spelling-error': ['terminal'],
        '::target-text': ['terminal'],
        '::file-selector-button': ['terminal', 'actionable'],
        '::-webkit-progress-bar': ['terminal', 'actionable'],
        '::-webkit-scrollbar': ['terminal', 'actionable'],
        '::-webkit-scrollbar-button': ['terminal', 'actionable'],
        '::-webkit-scrollbar-thumb': ['terminal', 'actionable'],
        '::-webkit-scrollbar-track': ['terminal', 'actionable'],
        '::-webkit-scrollbar-track-piece': ['terminal', 'actionable'],
        '::-webkit-scrollbar-corner': ['terminal', 'actionable'],
        '::-webkit-resizer': ['terminal', 'actionable'],
        ':after': ['terminal', 'jumpable'],
        ':before': ['terminal', 'jumpable'],
        ':first-letter': ['terminal', 'jumpable'],
        ':first-line': ['terminal', 'jumpable'],
        __default__: ['actionable'],
      };
    });
  function Nt(r, { context: e, candidate: t }) {
    let i = e?.tailwindConfig.prefix ?? '',
      n = r.map((a) => {
        let o = (0, Le.default)().astSync(a.format);
        return { ...a, ast: a.isArbitraryVariant ? o : qt(i, o) };
      }),
      s = Le.default.root({
        nodes: [
          Le.default.selector({
            nodes: [Le.default.className({ value: ce(t) })],
          }),
        ],
      });
    for (let { ast: a } of n)
      ([s, a] = HS(s, a)),
        a.walkNesting((o) => o.replaceWith(...s.nodes[0].nodes)),
        (s = a);
    return s;
  }
  function ud(r) {
    let e = [];
    for (; r.prev() && r.prev().type !== 'combinator'; ) r = r.prev();
    for (; r && r.type !== 'combinator'; ) e.push(r), (r = r.next());
    return e;
  }
  function GS(r) {
    return (
      r.sort((e, t) =>
        e.type === 'tag' && t.type === 'class'
          ? -1
          : e.type === 'class' && t.type === 'tag'
          ? 1
          : e.type === 'class' &&
            t.type === 'pseudo' &&
            t.value.startsWith('::')
          ? -1
          : e.type === 'pseudo' &&
            e.value.startsWith('::') &&
            t.type === 'class'
          ? 1
          : r.index(e) - r.index(t)
      ),
      r
    );
  }
  function Ha(r, e) {
    let t = !1;
    r.walk((i) => {
      if (i.type === 'class' && i.value === e) return (t = !0), !1;
    }),
      t || r.remove();
  }
  function dn(r, e, { context: t, candidate: i, base: n }) {
    let s = t?.tailwindConfig?.separator ?? ':';
    n = n ?? i.split(new RegExp(`\\${s}(?![^[]*\\])`)).pop();
    let a = (0, Le.default)().astSync(r);
    a.walkClasses((f) => {
      f.raws &&
        f.value.includes(n) &&
        (f.raws.value = ce((0, ld.default)(f.raws.value)));
    }),
      a.each((f) => Ha(f, n));
    let o = Array.isArray(e) ? Nt(e, { context: t, candidate: i }) : e;
    if (o === null) return a.toString();
    let u = Le.default.comment({ value: '/*__simple__*/' }),
      c = Le.default.comment({ value: '/*__simple__*/' });
    return (
      a.walkClasses((f) => {
        if (f.value !== n) return;
        let p = f.parent,
          d = o.nodes[0].nodes;
        if (p.nodes.length === 1) {
          f.replaceWith(...d);
          return;
        }
        let h = ud(f);
        p.insertBefore(h[0], u), p.insertAfter(h[h.length - 1], c);
        for (let x of d) p.insertBefore(h[0], x.clone());
        f.remove(), (h = ud(u));
        let y = p.index(u);
        p.nodes.splice(
          y,
          h.length,
          ...GS(Le.default.selector({ nodes: h })).nodes
        ),
          u.remove(),
          c.remove();
      }),
      a.walkPseudos((f) => {
        f.value === Ga && f.replaceWith(f.nodes);
      }),
      a.each((f) => Ft(f)),
      a.toString()
    );
  }
  function HS(r, e) {
    let t = [];
    return (
      r.walkPseudos((i) => {
        i.value === Ga && t.push({ pseudo: i, value: i.nodes[0].toString() });
      }),
      e.walkPseudos((i) => {
        if (i.value !== Ga) return;
        let n = i.nodes[0].toString(),
          s = t.find((c) => c.value === n);
        if (!s) return;
        let a = [],
          o = i.next();
        for (; o && o.type !== 'combinator'; ) a.push(o), (o = o.next());
        let u = o;
        s.pseudo.parent.insertAfter(
          s.pseudo,
          Le.default.selector({ nodes: a.map((c) => c.clone()) })
        ),
          i.remove(),
          a.forEach((c) => c.remove()),
          u && u.type === 'combinator' && u.remove();
      }),
      [r, e]
    );
  }
  var Le,
    ld,
    Ga,
    Ya = C(() => {
      l();
      (Le = K(Me())), (ld = K(Vi()));
      Rt();
      nn();
      pn();
      Ga = ':merge';
    });
  function hn(r, e) {
    let t = (0, Qa.default)().astSync(r);
    return (
      t.each((i) => {
        (i.nodes[0].type === 'pseudo' &&
          i.nodes[0].value === ':is' &&
          i.nodes.every((s) => s.type !== 'combinator')) ||
          (i.nodes = [Qa.default.pseudo({ value: ':is', nodes: [i.clone()] })]),
          Ft(i);
      }),
      `${e} ${t.toString()}`
    );
  }
  var Qa,
    Ja = C(() => {
      l();
      Qa = K(Me());
      pn();
    });
  function Xa(r) {
    return YS.transformSync(r);
  }
  function* QS(r) {
    let e = 1 / 0;
    for (; e >= 0; ) {
      let t,
        i = !1;
      if (e === 1 / 0 && r.endsWith(']')) {
        let a = r.indexOf('[');
        r[a - 1] === '-'
          ? (t = a - 1)
          : r[a - 1] === '/'
          ? ((t = a - 1), (i = !0))
          : (t = -1);
      } else
        e === 1 / 0 && r.includes('/')
          ? ((t = r.lastIndexOf('/')), (i = !0))
          : (t = r.lastIndexOf('-', e));
      if (t < 0) break;
      let n = r.slice(0, t),
        s = r.slice(i ? t : t + 1);
      (e = t - 1), !(n === '' || s === '/') && (yield [n, s]);
    }
  }
  function JS(r, e) {
    if (r.length === 0 || e.tailwindConfig.prefix === '') return r;
    for (let t of r) {
      let [i] = t;
      if (i.options.respectPrefix) {
        let n = j.root({ nodes: [t[1].clone()] }),
          s = t[1].raws.tailwind.classCandidate;
        n.walkRules((a) => {
          let o = s.startsWith('-');
          a.selector = qt(e.tailwindConfig.prefix, a.selector, o);
        }),
          (t[1] = n.nodes[0]);
      }
    }
    return r;
  }
  function XS(r, e) {
    if (r.length === 0) return r;
    let t = [];
    for (let [i, n] of r) {
      let s = j.root({ nodes: [n.clone()] });
      s.walkRules((a) => {
        let o = (0, mn.default)().astSync(a.selector);
        o.each((u) => Ha(u, e)),
          Tu(o, (u) => (u === e ? `!${u}` : u)),
          (a.selector = o.toString()),
          a.walkDecls((u) => (u.important = !0));
      }),
        t.push([{ ...i, important: !0 }, s.nodes[0]]);
    }
    return t;
  }
  function KS(r, e, t) {
    if (e.length === 0) return e;
    let i = { modifier: null, value: Yr };
    {
      let [n, ...s] = le(r, '/');
      if (
        (s.length > 1 &&
          ((n = n + '/' + s.slice(0, -1).join('/')), (s = s.slice(-1))),
        s.length &&
          !t.variantMap.has(r) &&
          ((r = n),
          (i.modifier = s[0]),
          !J(t.tailwindConfig, 'generalizedModifiers')))
      )
        return [];
    }
    if (r.endsWith(']') && !r.startsWith('[')) {
      let n = /(.)(-?)\[(.*)\]/g.exec(r);
      if (n) {
        let [, s, a, o] = n;
        if (s === '@' && a === '-') return [];
        if (s !== '@' && a === '') return [];
        (r = r.replace(`${a}[${o}]`, '')), (i.value = o);
      }
    }
    if (Za(r) && !t.variantMap.has(r)) {
      let n = t.offsets.recordVariant(r),
        s = V(r.slice(1, -1)),
        a = le(s, ',');
      if (a.length > 1) return [];
      if (!a.every(vn)) return [];
      let o = a.map((u, c) => [
        t.offsets.applyParallelOffset(n, c),
        Qr(u.trim()),
      ]);
      t.variantMap.set(r, o);
    }
    if (t.variantMap.has(r)) {
      let n = Za(r),
        s = t.variantMap.get(r).slice(),
        a = [];
      for (let [o, u] of e) {
        if (o.layer === 'user') continue;
        let c = j.root({ nodes: [u.clone()] });
        for (let [f, p, d] of s) {
          let x = function () {
              h.raws.neededBackup ||
                ((h.raws.neededBackup = !0),
                h.walkRules((S) => (S.raws.originalSelector = S.selector)));
            },
            b = function (S) {
              return (
                x(),
                h.each((_) => {
                  _.type === 'rule' &&
                    (_.selectors = _.selectors.map((P) =>
                      S({
                        get className() {
                          return Xa(P);
                        },
                        selector: P,
                      })
                    ));
                }),
                h
              );
            },
            h = (d ?? c).clone(),
            y = [],
            w = p({
              get container() {
                return x(), h;
              },
              separator: t.tailwindConfig.separator,
              modifySelectors: b,
              wrap(S) {
                let _ = h.nodes;
                h.removeAll(), S.append(_), h.append(S);
              },
              format(S) {
                y.push({ format: S, isArbitraryVariant: n });
              },
              args: i,
            });
          if (Array.isArray(w)) {
            for (let [S, _] of w.entries())
              s.push([t.offsets.applyParallelOffset(f, S), _, h.clone()]);
            continue;
          }
          if (
            (typeof w == 'string' &&
              y.push({ format: w, isArbitraryVariant: n }),
            w === null)
          )
            continue;
          h.raws.neededBackup &&
            (delete h.raws.neededBackup,
            h.walkRules((S) => {
              let _ = S.raws.originalSelector;
              if (!_ || (delete S.raws.originalSelector, _ === S.selector))
                return;
              let P = S.selector,
                M = (0, mn.default)((F) => {
                  F.walkClasses((I) => {
                    I.value = `${r}${t.tailwindConfig.separator}${I.value}`;
                  });
                }).processSync(_);
              y.push({ format: P.replace(M, '&'), isArbitraryVariant: n }),
                (S.selector = _);
            })),
            (h.nodes[0].raws.tailwind = {
              ...h.nodes[0].raws.tailwind,
              parentLayer: o.layer,
            });
          let k = [
            {
              ...o,
              sort: t.offsets.applyVariantOffset(
                o.sort,
                f,
                Object.assign(i, t.variantOptions.get(r))
              ),
              collectedFormats: (o.collectedFormats ?? []).concat(y),
            },
            h.nodes[0],
          ];
          a.push(k);
        }
      }
      return a;
    }
    return [];
  }
  function Ka(r, e, t = {}) {
    return !se(r) && !Array.isArray(r)
      ? [[r], t]
      : Array.isArray(r)
      ? Ka(r[0], e, r[1])
      : (e.has(r) || e.set(r, It(r)), [e.get(r), t]);
  }
  function e2(r) {
    return ZS.test(r);
  }
  function t2(r) {
    if (!r.includes('://')) return !1;
    try {
      let e = new URL(r);
      return e.scheme !== '' && e.host !== '';
    } catch (e) {
      return !1;
    }
  }
  function fd(r) {
    let e = !0;
    return (
      r.walkDecls((t) => {
        if (!cd(t.prop, t.value)) return (e = !1), !1;
      }),
      e
    );
  }
  function cd(r, e) {
    if (t2(`${r}:${e}`)) return !1;
    try {
      return j.parse(`a{${r}:${e}}`).toResult(), !0;
    } catch (t) {
      return !1;
    }
  }
  function r2(r, e) {
    let [, t, i] = r.match(/^\[([a-zA-Z0-9-_]+):(\S+)\]$/) ?? [];
    if (i === void 0 || !e2(t) || !Mt(i)) return null;
    let n = V(i);
    return cd(t, n)
      ? [
          [
            { sort: e.offsets.arbitraryProperty(), layer: 'utilities' },
            () => ({ [Fa(r)]: { [t]: n } }),
          ],
        ]
      : null;
  }
  function* i2(r, e) {
    e.candidateRuleMap.has(r) && (yield [e.candidateRuleMap.get(r), 'DEFAULT']),
      yield* (function* (o) {
        o !== null && (yield [o, 'DEFAULT']);
      })(r2(r, e));
    let t = r,
      i = !1,
      n = e.tailwindConfig.prefix,
      s = n.length,
      a = t.startsWith(n) || t.startsWith(`-${n}`);
    t[s] === '-' && a && ((i = !0), (t = n + t.slice(s + 1))),
      i &&
        e.candidateRuleMap.has(t) &&
        (yield [e.candidateRuleMap.get(t), '-DEFAULT']);
    for (let [o, u] of QS(t))
      e.candidateRuleMap.has(o) &&
        (yield [e.candidateRuleMap.get(o), i ? `-${u}` : u]);
  }
  function n2(r, e) {
    return r === Ge ? [Ge] : le(r, e);
  }
  function* s2(r, e) {
    for (let t of r)
      (t[1].raws.tailwind = {
        ...t[1].raws.tailwind,
        classCandidate: e,
        preserveSource: t[0].options?.preserveSource ?? !1,
      }),
        yield t;
  }
  function* gn(r, e, t = r) {
    let i = e.tailwindConfig.separator,
      [n, ...s] = n2(r, i).reverse(),
      a = !1;
    if (
      (n.startsWith('!') && ((a = !0), (n = n.slice(1))),
      J(e.tailwindConfig, 'variantGrouping') &&
        n.startsWith('(') &&
        n.endsWith(')'))
    ) {
      let o = s.slice().reverse().join(i);
      for (let u of le(n.slice(1, -1), ',')) yield* gn(o + i + u, e, t);
    }
    for (let o of i2(n, e)) {
      let u = [],
        c = new Map(),
        [f, p] = o,
        d = f.length === 1;
      for (let [h, y] of f) {
        let x = [];
        if (typeof y == 'function')
          for (let b of [].concat(y(p, { isOnlyPlugin: d }))) {
            let [w, k] = Ka(b, e.postCssNodeCache);
            for (let S of w)
              x.push([{ ...h, options: { ...h.options, ...k } }, S]);
          }
        else if (p === 'DEFAULT' || p === '-DEFAULT') {
          let b = y,
            [w, k] = Ka(b, e.postCssNodeCache);
          for (let S of w)
            x.push([{ ...h, options: { ...h.options, ...k } }, S]);
        }
        if (x.length > 0) {
          let b = Array.from(
            is(h.options?.types ?? [], p, h.options ?? {}, e.tailwindConfig)
          ).map(([w, k]) => k);
          b.length > 0 && c.set(x, b), u.push(x);
        }
      }
      if (Za(p)) {
        if (u.length > 1) {
          let x = function (w) {
              return w.length === 1
                ? w[0]
                : w.find((k) => {
                    let S = c.get(k);
                    return k.some(([{ options: _ }, P]) =>
                      fd(P)
                        ? _.types.some(
                            ({ type: M, preferOnConflict: F }) =>
                              S.includes(M) && F
                          )
                        : !1
                    );
                  });
            },
            [h, y] = u.reduce(
              (w, k) => (
                k.some(([{ options: _ }]) =>
                  _.types.some(({ type: P }) => P === 'any')
                )
                  ? w[0].push(k)
                  : w[1].push(k),
                w
              ),
              [[], []]
            ),
            b = x(y) ?? x(h);
          if (b) u = [b];
          else {
            let w = u.map((S) => new Set([...(c.get(S) ?? [])]));
            for (let S of w)
              for (let _ of S) {
                let P = !1;
                for (let M of w) S !== M && M.has(_) && (M.delete(_), (P = !0));
                P && S.delete(_);
              }
            let k = [];
            for (let [S, _] of w.entries())
              for (let P of _) {
                let M = u[S].map(([, F]) => F)
                  .flat()
                  .map((F) =>
                    F.toString()
                      .split(
                        `
`
                      )
                      .slice(1, -1)
                      .map((I) => I.trim())
                      .map((I) => `      ${I}`).join(`
`)
                  ).join(`

`);
                k.push(
                  `  Use \`${r.replace('[', `[${P}:`)}\` for \`${M.trim()}\``
                );
                break;
              }
            N.warn([
              `The class \`${r}\` is ambiguous and matches multiple utilities.`,
              ...k,
              `If this is content and not a class, replace it with \`${r
                .replace('[', '&lsqb;')
                .replace(']', '&rsqb;')}\` to silence this warning.`,
            ]);
            continue;
          }
        }
        u = u.map((h) => h.filter((y) => fd(y[1])));
      }
      (u = u.flat()),
        (u = Array.from(s2(u, n))),
        (u = JS(u, e)),
        a && (u = XS(u, n));
      for (let h of s) u = KS(h, u, e);
      for (let h of u)
        (h[1].raws.tailwind = { ...h[1].raws.tailwind, candidate: r }),
          (h = a2(h, { context: e, candidate: r, original: t })),
          h !== null && (yield h);
    }
  }
  function a2(r, { context: e, candidate: t, original: i }) {
    if (!r[0].collectedFormats) return r;
    let n = !0,
      s;
    try {
      s = Nt(r[0].collectedFormats, { context: e, candidate: t });
    } catch {
      return null;
    }
    let a = j.root({ nodes: [r[1].clone()] });
    return (
      a.walkRules((o) => {
        if (!yn(o))
          try {
            o.selector = dn(o.selector, s, { candidate: i, context: e });
          } catch {
            return (n = !1), !1;
          }
      }),
      n ? ((r[1] = a.nodes[0]), r) : null
    );
  }
  function yn(r) {
    return (
      r.parent && r.parent.type === 'atrule' && r.parent.name === 'keyframes'
    );
  }
  function o2(r) {
    if (r === !0)
      return (e) => {
        yn(e) ||
          e.walkDecls((t) => {
            t.parent.type === 'rule' && !yn(t.parent) && (t.important = !0);
          });
      };
    if (typeof r == 'string')
      return (e) => {
        yn(e) || (e.selectors = e.selectors.map((t) => hn(t, r)));
      };
  }
  function bn(r, e) {
    let t = [],
      i = o2(e.tailwindConfig.important);
    for (let n of r) {
      if (e.notClassCache.has(n)) continue;
      if (e.candidateRuleCache.has(n)) {
        t = t.concat(Array.from(e.candidateRuleCache.get(n)));
        continue;
      }
      let s = Array.from(gn(n, e));
      if (s.length === 0) {
        e.notClassCache.add(n);
        continue;
      }
      e.classCache.set(n, s);
      let a = e.candidateRuleCache.get(n) ?? new Set();
      e.candidateRuleCache.set(n, a);
      for (let o of s) {
        let [{ sort: u, options: c }, f] = o;
        if (c.respectImportant && i) {
          let d = j.root({ nodes: [f.clone()] });
          d.walkRules(i), (f = d.nodes[0]);
        }
        let p = [u, f];
        a.add(p), e.ruleCache.add(p), t.push(p);
      }
    }
    return t;
  }
  function Za(r) {
    return r.startsWith('[') && r.endsWith(']');
  }
  var mn,
    YS,
    ZS,
    wn = C(() => {
      l();
      it();
      mn = K(Me());
      Ma();
      vt();
      nn();
      ur();
      Oe();
      at();
      Ya();
      Na();
      lr();
      xn();
      Va();
      sr();
      De();
      Ja();
      YS = (0, mn.default)(
        (r) => r.first.filter(({ type: e }) => e === 'class').pop().value
      );
      ZS = /^[a-z_-]/;
    });
  var pd,
    dd = C(() => {
      l();
      pd = {};
    });
  function l2(r) {
    try {
      return pd.createHash('md5').update(r, 'utf-8').digest('binary');
    } catch (e) {
      return '';
    }
  }
  function hd(r, e) {
    let t = e.toString();
    if (!t.includes('@tailwind')) return !1;
    let i = za.get(r),
      n = l2(t),
      s = i !== n;
    return za.set(r, n), s;
  }
  var md = C(() => {
    l();
    dd();
    at();
  });
  function kn(r) {
    return (r > 0n) - (r < 0n);
  }
  var gd = C(() => {
    l();
  });
  function yd(r, e) {
    let t = 0n,
      i = 0n;
    for (let [n, s] of e) r & n && ((t = t | n), (i = i | s));
    return (r & ~t) | i;
  }
  var bd = C(() => {
    l();
  });
  function wd(r) {
    let e = null;
    for (let t of r) (e = e ?? t), (e = e > t ? e : t);
    return e;
  }
  function u2(r, e) {
    let t = r.length,
      i = e.length,
      n = t < i ? t : i;
    for (let s = 0; s < n; s++) {
      let a = r.charCodeAt(s) - e.charCodeAt(s);
      if (a !== 0) return a;
    }
    return t - i;
  }
  var eo,
    vd = C(() => {
      l();
      gd();
      bd();
      eo = class {
        constructor() {
          (this.offsets = {
            defaults: 0n,
            base: 0n,
            components: 0n,
            utilities: 0n,
            variants: 0n,
            user: 0n,
          }),
            (this.layerPositions = {
              defaults: 0n,
              base: 1n,
              components: 2n,
              utilities: 3n,
              user: 4n,
              variants: 5n,
            }),
            (this.reservedVariantBits = 0n),
            (this.variantOffsets = new Map());
        }
        create(e) {
          return {
            layer: e,
            parentLayer: e,
            arbitrary: 0n,
            variants: 0n,
            parallelIndex: 0n,
            index: this.offsets[e]++,
            options: [],
          };
        }
        arbitraryProperty() {
          return { ...this.create('utilities'), arbitrary: 1n };
        }
        forVariant(e, t = 0) {
          let i = this.variantOffsets.get(e);
          if (i === void 0)
            throw new Error(`Cannot find offset for unknown variant ${e}`);
          return { ...this.create('variants'), variants: i << BigInt(t) };
        }
        applyVariantOffset(e, t, i) {
          return (
            (i.variant = t.variants),
            {
              ...e,
              layer: 'variants',
              parentLayer: e.layer === 'variants' ? e.parentLayer : e.layer,
              variants: e.variants | t.variants,
              options: i.sort ? [].concat(i, e.options) : e.options,
              parallelIndex: wd([e.parallelIndex, t.parallelIndex]),
            }
          );
        }
        applyParallelOffset(e, t) {
          return { ...e, parallelIndex: BigInt(t) };
        }
        recordVariants(e, t) {
          for (let i of e) this.recordVariant(i, t(i));
        }
        recordVariant(e, t = 1) {
          return (
            this.variantOffsets.set(e, 1n << this.reservedVariantBits),
            (this.reservedVariantBits += BigInt(t)),
            { ...this.create('variants'), variants: this.variantOffsets.get(e) }
          );
        }
        compare(e, t) {
          if (e.layer !== t.layer)
            return this.layerPositions[e.layer] - this.layerPositions[t.layer];
          if (e.parentLayer !== t.parentLayer)
            return (
              this.layerPositions[e.parentLayer] -
              this.layerPositions[t.parentLayer]
            );
          for (let i of e.options)
            for (let n of t.options) {
              if (i.id !== n.id || !i.sort || !n.sort) continue;
              let s = wd([i.variant, n.variant]) ?? 0n,
                a = ~(s | (s - 1n)),
                o = e.variants & a,
                u = t.variants & a;
              if (o !== u) continue;
              let c = i.sort(
                { value: i.value, modifier: i.modifier },
                { value: n.value, modifier: n.modifier }
              );
              if (c !== 0) return c;
            }
          return e.variants !== t.variants
            ? e.variants - t.variants
            : e.parallelIndex !== t.parallelIndex
            ? e.parallelIndex - t.parallelIndex
            : e.arbitrary !== t.arbitrary
            ? e.arbitrary - t.arbitrary
            : e.index - t.index;
        }
        recalculateVariantOffsets() {
          let e = Array.from(this.variantOffsets.entries())
              .filter(([n]) => n.startsWith('['))
              .sort(([n], [s]) => u2(n, s)),
            t = e.map(([, n]) => n).sort((n, s) => kn(n - s));
          return e.map(([, n], s) => [n, t[s]]).filter(([n, s]) => n !== s);
        }
        remapArbitraryVariantOffsets(e) {
          let t = this.recalculateVariantOffsets();
          return t.length === 0
            ? e
            : e.map((i) => {
                let [n, s] = i;
                return (n = { ...n, variants: yd(n.variants, t) }), [n, s];
              });
        }
        sort(e) {
          return (
            (e = this.remapArbitraryVariantOffsets(e)),
            e.sort(([t], [i]) => kn(this.compare(t, i)))
          );
        }
      };
    });
  function no(r, e) {
    let t = r.tailwindConfig.prefix;
    return typeof t == 'function' ? t(e) : t + e;
  }
  function kd({ type: r = 'any', ...e }) {
    let t = [].concat(r);
    return {
      ...e,
      types: t.map((i) =>
        Array.isArray(i)
          ? { type: i[0], ...i[1] }
          : { type: i, preferOnConflict: !1 }
      ),
    };
  }
  function f2(r) {
    let e = [],
      t = '',
      i = 0;
    for (let n = 0; n < r.length; n++) {
      let s = r[n];
      if (s === '\\') t += '\\' + r[++n];
      else if (s === '{') ++i, e.push(t.trim()), (t = '');
      else if (s === '}') {
        if (--i < 0) throw new Error('Your { and } are unbalanced.');
        e.push(t.trim()), (t = '');
      } else t += s;
    }
    return t.length > 0 && e.push(t.trim()), (e = e.filter((n) => n !== '')), e;
  }
  function c2(r, e, { before: t = [] } = {}) {
    if (((t = [].concat(t)), t.length <= 0)) {
      r.push(e);
      return;
    }
    let i = r.length - 1;
    for (let n of t) {
      let s = r.indexOf(n);
      s !== -1 && (i = Math.min(i, s));
    }
    r.splice(i, 0, e);
  }
  function Sd(r) {
    return Array.isArray(r)
      ? r.flatMap((e) => (!Array.isArray(e) && !se(e) ? e : It(e)))
      : Sd([r]);
  }
  function _d(r, e) {
    return (0, to.default)((i) => {
      let n = [];
      return (
        e && e(i),
        i.walkClasses((s) => {
          n.push(s.value);
        }),
        n
      );
    }).transformSync(r);
  }
  function p2(r, e = { containsNonOnDemandable: !1 }, t = 0) {
    let i = [];
    if (r.type === 'rule') {
      let n = function (s) {
        s.walkPseudos((a) => {
          a.value === ':not' && a.remove();
        });
      };
      for (let s of r.selectors) {
        let a = _d(s, n);
        a.length === 0 && (e.containsNonOnDemandable = !0);
        for (let o of a) i.push(o);
      }
    } else
      r.type === 'atrule' &&
        r.walkRules((n) => {
          for (let s of n.selectors.flatMap((a) => _d(a))) i.push(s);
        });
    return t === 0 ? [e.containsNonOnDemandable || i.length === 0, i] : i;
  }
  function Sn(r) {
    return Sd(r).flatMap((e) => {
      let t = new Map(),
        [i, n] = p2(e);
      return (
        i && n.unshift(Ge),
        n.map((s) => (t.has(e) || t.set(e, e), [s, t.get(e)]))
      );
    });
  }
  function vn(r) {
    return r.startsWith('@') || r.includes('&');
  }
  function Qr(r) {
    r = r
      .replace(/\n+/g, '')
      .replace(/\s{1,}/g, ' ')
      .trim();
    let e = f2(r)
      .map((t) => {
        if (!t.startsWith('@')) return ({ format: s }) => s(t);
        let [, i, n] = /@(.*?)( .+|[({].*)/g.exec(t);
        return ({ wrap: s }) => s(j.atRule({ name: i, params: n.trim() }));
      })
      .reverse();
    return (t) => {
      for (let i of e) i(t);
    };
  }
  function d2(
    r,
    e,
    { variantList: t, variantMap: i, offsets: n, classList: s }
  ) {
    function a(d, h) {
      return d ? (0, xd.default)(r, d, h) : r;
    }
    function o(d) {
      return qt(r.prefix, d);
    }
    function u(d, h) {
      return d === Ge ? Ge : h.respectPrefix ? e.tailwindConfig.prefix + d : d;
    }
    function c(d, h, y = {}) {
      let x = Xe(d),
        b = a(['theme', ...x], h);
      return We(x[0])(b, y);
    }
    let f = 0,
      p = {
        postcss: j,
        prefix: o,
        e: ce,
        config: a,
        theme: c,
        corePlugins: (d) =>
          Array.isArray(r.corePlugins)
            ? r.corePlugins.includes(d)
            : a(['corePlugins', d], !0),
        variants: () => [],
        addBase(d) {
          for (let [h, y] of Sn(d)) {
            let x = u(h, {}),
              b = n.create('base');
            e.candidateRuleMap.has(x) || e.candidateRuleMap.set(x, []),
              e.candidateRuleMap.get(x).push([{ sort: b, layer: 'base' }, y]);
          }
        },
        addDefaults(d, h) {
          let y = { [`@defaults ${d}`]: h };
          for (let [x, b] of Sn(y)) {
            let w = u(x, {});
            e.candidateRuleMap.has(w) || e.candidateRuleMap.set(w, []),
              e.candidateRuleMap
                .get(w)
                .push([{ sort: n.create('defaults'), layer: 'defaults' }, b]);
          }
        },
        addComponents(d, h) {
          h = Object.assign(
            {},
            { preserveSource: !1, respectPrefix: !0, respectImportant: !1 },
            Array.isArray(h) ? {} : h
          );
          for (let [x, b] of Sn(d)) {
            let w = u(x, h);
            s.add(w),
              e.candidateRuleMap.has(w) || e.candidateRuleMap.set(w, []),
              e.candidateRuleMap.get(w).push([
                {
                  sort: n.create('components'),
                  layer: 'components',
                  options: h,
                },
                b,
              ]);
          }
        },
        addUtilities(d, h) {
          h = Object.assign(
            {},
            { preserveSource: !1, respectPrefix: !0, respectImportant: !0 },
            Array.isArray(h) ? {} : h
          );
          for (let [x, b] of Sn(d)) {
            let w = u(x, h);
            s.add(w),
              e.candidateRuleMap.has(w) || e.candidateRuleMap.set(w, []),
              e.candidateRuleMap.get(w).push([
                {
                  sort: n.create('utilities'),
                  layer: 'utilities',
                  options: h,
                },
                b,
              ]);
          }
        },
        matchUtilities: function (d, h) {
          h = kd({
            ...{ respectPrefix: !0, respectImportant: !0, modifiers: !1 },
            ...h,
          });
          let x = n.create('utilities');
          for (let b in d) {
            let S = function (P, { isOnlyPlugin: M }) {
                let [F, I, X] = rs(h.types, P, h, r);
                if (F === void 0) return [];
                if (!h.types.some(({ type: ee }) => ee === I))
                  if (M)
                    N.warn([
                      `Unnecessary typehint \`${I}\` in \`${b}-${P}\`.`,
                      `You can safely update it to \`${b}-${P.replace(
                        I + ':',
                        ''
                      )}\`.`,
                    ]);
                  else return [];
                if (!Mt(F)) return [];
                let ge = {
                    get modifier() {
                      return (
                        h.modifiers ||
                          N.warn(`modifier-used-without-options-for-${b}`, [
                            'Your plugin must set `modifiers: true` in its options to support modifiers.',
                          ]),
                        X
                      );
                    },
                  },
                  Q = J(r, 'generalizedModifiers');
                return []
                  .concat(Q ? k(F, ge) : k(F))
                  .filter(Boolean)
                  .map((ee) => ({ [sn(b, P)]: ee }));
              },
              w = u(b, h),
              k = d[b];
            s.add([w, h]);
            let _ = [{ sort: x, layer: 'utilities', options: h }, S];
            e.candidateRuleMap.has(w) || e.candidateRuleMap.set(w, []),
              e.candidateRuleMap.get(w).push(_);
          }
        },
        matchComponents: function (d, h) {
          h = kd({
            ...{ respectPrefix: !0, respectImportant: !1, modifiers: !1 },
            ...h,
          });
          let x = n.create('components');
          for (let b in d) {
            let S = function (P, { isOnlyPlugin: M }) {
                let [F, I, X] = rs(h.types, P, h, r);
                if (F === void 0) return [];
                if (!h.types.some(({ type: ee }) => ee === I))
                  if (M)
                    N.warn([
                      `Unnecessary typehint \`${I}\` in \`${b}-${P}\`.`,
                      `You can safely update it to \`${b}-${P.replace(
                        I + ':',
                        ''
                      )}\`.`,
                    ]);
                  else return [];
                if (!Mt(F)) return [];
                let ge = {
                    get modifier() {
                      return (
                        h.modifiers ||
                          N.warn(`modifier-used-without-options-for-${b}`, [
                            'Your plugin must set `modifiers: true` in its options to support modifiers.',
                          ]),
                        X
                      );
                    },
                  },
                  Q = J(r, 'generalizedModifiers');
                return []
                  .concat(Q ? k(F, ge) : k(F))
                  .filter(Boolean)
                  .map((ee) => ({ [sn(b, P)]: ee }));
              },
              w = u(b, h),
              k = d[b];
            s.add([w, h]);
            let _ = [{ sort: x, layer: 'components', options: h }, S];
            e.candidateRuleMap.has(w) || e.candidateRuleMap.set(w, []),
              e.candidateRuleMap.get(w).push(_);
          }
        },
        addVariant(d, h, y = {}) {
          (h = [].concat(h).map((x) => {
            if (typeof x != 'string')
              return (b = {}) => {
                let {
                    args: w,
                    modifySelectors: k,
                    container: S,
                    separator: _,
                    wrap: P,
                    format: M,
                  } = b,
                  F = x(
                    Object.assign(
                      { modifySelectors: k, container: S, separator: _ },
                      y.type === ro.MatchVariant && {
                        args: w,
                        wrap: P,
                        format: M,
                      }
                    )
                  );
                if (typeof F == 'string' && !vn(F))
                  throw new Error(
                    `Your custom variant \`${d}\` has an invalid format string. Make sure it's an at-rule or contains a \`&\` placeholder.`
                  );
                return Array.isArray(F)
                  ? F.filter((I) => typeof I == 'string').map((I) => Qr(I))
                  : F && typeof F == 'string' && Qr(F)(b);
              };
            if (!vn(x))
              throw new Error(
                `Your custom variant \`${d}\` has an invalid format string. Make sure it's an at-rule or contains a \`&\` placeholder.`
              );
            return Qr(x);
          })),
            c2(t, d, y),
            i.set(d, h),
            e.variantOptions.set(d, y);
        },
        matchVariant(d, h, y) {
          let x = y?.id ?? ++f,
            b = d === '@',
            w = J(r, 'generalizedModifiers');
          for (let [S, _] of Object.entries(y?.values ?? {}))
            S !== 'DEFAULT' &&
              p.addVariant(
                b ? `${d}${S}` : `${d}-${S}`,
                ({ args: P, container: M }) =>
                  h(
                    _,
                    w
                      ? { modifier: P?.modifier, container: M }
                      : { container: M }
                  ),
                {
                  ...y,
                  value: _,
                  id: x,
                  type: ro.MatchVariant,
                  variantInfo: io.Base,
                }
              );
          let k = 'DEFAULT' in (y?.values ?? {});
          p.addVariant(
            d,
            ({ args: S, container: _ }) =>
              S?.value === Yr && !k
                ? null
                : h(
                    S?.value === Yr
                      ? y.values.DEFAULT
                      : S?.value ?? (typeof S == 'string' ? S : ''),
                    w
                      ? { modifier: S?.modifier, container: _ }
                      : { container: _ }
                  ),
            { ...y, id: x, type: ro.MatchVariant, variantInfo: io.Dynamic }
          );
        },
      };
    return p;
  }
  function _n(r) {
    return so.has(r) || so.set(r, new Map()), so.get(r);
  }
  function Cd(r, e) {
    let t = !1,
      i = new Map();
    for (let n of r) {
      if (!n) continue;
      let s = us.parse(n),
        a = s.hash ? s.href.replace(s.hash, '') : s.href;
      a = s.search ? a.replace(s.search, '') : a;
      let o = ie.statSync(decodeURIComponent(a), {
        throwIfNoEntry: !1,
      })?.mtimeMs;
      !o || ((!e.has(n) || o > e.get(n)) && (t = !0), i.set(n, o));
    }
    return [t, i];
  }
  function Ad(r) {
    r.walkAtRules((e) => {
      ['responsive', 'variants'].includes(e.name) &&
        (Ad(e), e.before(e.nodes), e.remove());
    });
  }
  function h2(r) {
    let e = [];
    return (
      r.each((t) => {
        t.type === 'atrule' &&
          ['responsive', 'variants'].includes(t.name) &&
          ((t.name = 'layer'), (t.params = 'utilities'));
      }),
      r.walkAtRules('layer', (t) => {
        if ((Ad(t), t.params === 'base')) {
          for (let i of t.nodes)
            e.push(function ({ addBase: n }) {
              n(i, { respectPrefix: !1 });
            });
          t.remove();
        } else if (t.params === 'components') {
          for (let i of t.nodes)
            e.push(function ({ addComponents: n }) {
              n(i, { respectPrefix: !1, preserveSource: !0 });
            });
          t.remove();
        } else if (t.params === 'utilities') {
          for (let i of t.nodes)
            e.push(function ({ addUtilities: n }) {
              n(i, { respectPrefix: !1, preserveSource: !0 });
            });
          t.remove();
        }
      }),
      e
    );
  }
  function m2(r, e) {
    let t = Object.entries({ ...pe, ...ed })
        .map(([o, u]) => (r.tailwindConfig.corePlugins.includes(o) ? u : null))
        .filter(Boolean),
      i = r.tailwindConfig.plugins.map(
        (o) => (
          o.__isOptionsFunction && (o = o()),
          typeof o == 'function' ? o : o.handler
        )
      ),
      n = h2(e),
      s = [
        pe.pseudoElementVariants,
        pe.pseudoClassVariants,
        pe.ariaVariants,
        pe.dataVariants,
      ],
      a = [
        pe.supportsVariants,
        pe.directionVariants,
        pe.reducedMotionVariants,
        pe.prefersContrastVariants,
        pe.darkVariants,
        pe.printVariant,
        pe.screenVariants,
        pe.orientationVariants,
      ];
    return [...t, ...s, ...i, ...a, ...n];
  }
  function g2(r, e) {
    let t = [],
      i = new Map();
    e.variantMap = i;
    let n = new eo();
    e.offsets = n;
    let s = new Set(),
      a = d2(e.tailwindConfig, e, {
        variantList: t,
        variantMap: i,
        offsets: n,
        classList: s,
      });
    for (let f of r)
      if (Array.isArray(f)) for (let p of f) p(a);
      else f?.(a);
    n.recordVariants(t, (f) => i.get(f).length);
    for (let [f, p] of i.entries())
      e.variantMap.set(
        f,
        p.map((d, h) => [n.forVariant(f, h), d])
      );
    let o = (e.tailwindConfig.safelist ?? []).filter(Boolean);
    if (o.length > 0) {
      let f = [];
      for (let p of o) {
        if (typeof p == 'string') {
          e.changedContent.push({ content: p, extension: 'html' });
          continue;
        }
        if (p instanceof RegExp) {
          N.warn('root-regex', [
            'Regular expressions in `safelist` work differently in Tailwind CSS v3.0.',
            'Update your `safelist` configuration to eliminate this warning.',
            'https://tailwindcss.com/docs/content-configuration#safelisting-classes',
          ]);
          continue;
        }
        f.push(p);
      }
      if (f.length > 0) {
        let p = new Map(),
          d = e.tailwindConfig.prefix.length,
          h = f.some((y) => y.pattern.source.includes('!'));
        for (let y of s) {
          let x = Array.isArray(y)
            ? (() => {
                let [b, w] = y,
                  S = Object.keys(w?.values ?? {}).map((_) => Hr(b, _));
                return (
                  w?.supportsNegativeValues &&
                    ((S = [...S, ...S.map((_) => '-' + _)]),
                    (S = [
                      ...S,
                      ...S.map((_) => _.slice(0, d) + '-' + _.slice(d)),
                    ])),
                  w.types.some(({ type: _ }) => _ === 'color') &&
                    (S = [
                      ...S,
                      ...S.flatMap((_) =>
                        Object.keys(e.tailwindConfig.theme.opacity).map(
                          (P) => `${_}/${P}`
                        )
                      ),
                    ]),
                  h &&
                    w?.respectImportant &&
                    (S = [...S, ...S.map((_) => '!' + _)]),
                  S
                );
              })()
            : [y];
          for (let b of x)
            for (let { pattern: w, variants: k = [] } of f)
              if (((w.lastIndex = 0), p.has(w) || p.set(w, 0), !!w.test(b))) {
                p.set(w, p.get(w) + 1),
                  e.changedContent.push({ content: b, extension: 'html' });
                for (let S of k)
                  e.changedContent.push({
                    content: S + e.tailwindConfig.separator + b,
                    extension: 'html',
                  });
              }
        }
        for (let [y, x] of p.entries())
          x === 0 &&
            N.warn([
              `The safelist pattern \`${y}\` doesn't match any Tailwind CSS classes.`,
              'Fix this pattern or remove it from your `safelist` configuration.',
              'https://tailwindcss.com/docs/content-configuration#safelisting-classes',
            ]);
      }
    }
    let u = [].concat(e.tailwindConfig.darkMode ?? 'media')[1] ?? 'dark',
      c = [no(e, u), no(e, 'group'), no(e, 'peer')];
    (e.getClassOrder = function (p) {
      let d = [...p].sort((b, w) => (b === w ? 0 : b < w ? -1 : 1)),
        h = new Map(d.map((b) => [b, null])),
        y = bn(new Set(d), e);
      y = e.offsets.sort(y);
      let x = BigInt(c.length);
      for (let [, b] of y) h.set(b.raws.tailwind.candidate, x++);
      return p.map((b) => {
        let w = h.get(b) ?? null,
          k = c.indexOf(b);
        return w === null && k !== -1 && (w = BigInt(k)), [b, w];
      });
    }),
      (e.getClassList = function (p = {}) {
        let d = [];
        for (let h of s)
          if (Array.isArray(h)) {
            let [y, x] = h,
              b = [],
              w = Object.keys(x?.modifiers ?? {});
            x?.types?.some(({ type: _ }) => _ === 'color') &&
              w.push(...Object.keys(e.tailwindConfig.theme.opacity ?? {}));
            let k = { modifiers: w },
              S = p.includeMetadata && w.length > 0;
            for (let [_, P] of Object.entries(x?.values ?? {})) {
              if (P == null) continue;
              let M = Hr(y, _);
              if (
                (d.push(S ? [M, k] : M), x?.supportsNegativeValues && Je(P))
              ) {
                let F = Hr(y, `-${_}`);
                b.push(S ? [F, k] : F);
              }
            }
            d.push(...b);
          } else d.push(h);
        return d;
      }),
      (e.getVariants = function () {
        let p = [];
        for (let [d, h] of e.variantOptions.entries())
          h.variantInfo !== io.Base &&
            p.push({
              name: d,
              isArbitrary: h.type === Symbol.for('MATCH_VARIANT'),
              values: Object.keys(h.values ?? {}),
              hasDash: d !== '@',
              selectors({ modifier: y, value: x } = {}) {
                let b = '__TAILWIND_PLACEHOLDER__',
                  w = j.rule({ selector: `.${b}` }),
                  k = j.root({ nodes: [w.clone()] }),
                  S = k.toString(),
                  _ = (e.variantMap.get(d) ?? []).flatMap(([Q, Z]) => Z),
                  P = [];
                for (let Q of _) {
                  let Z = [],
                    ee = {
                      args: { modifier: y, value: h.values?.[x] ?? x },
                      separator: e.tailwindConfig.separator,
                      modifySelectors(_e) {
                        return (
                          k.each((jn) => {
                            jn.type === 'rule' &&
                              (jn.selectors = jn.selectors.map((Gl) =>
                                _e({
                                  get className() {
                                    return Xa(Gl);
                                  },
                                  selector: Gl,
                                })
                              ));
                          }),
                          k
                        );
                      },
                      format(_e) {
                        Z.push(_e);
                      },
                      wrap(_e) {
                        Z.push(`@${_e.name} ${_e.params} { & }`);
                      },
                      container: k,
                    },
                    wt = Q(ee);
                  if ((Z.length > 0 && P.push(Z), Array.isArray(wt)))
                    for (let _e of wt) (Z = []), _e(ee), P.push(Z);
                }
                let M = [],
                  F = k.toString();
                S !== F &&
                  (k.walkRules((Q) => {
                    let Z = Q.selector,
                      ee = (0, to.default)((wt) => {
                        wt.walkClasses((_e) => {
                          _e.value = `${d}${e.tailwindConfig.separator}${_e.value}`;
                        });
                      }).processSync(Z);
                    M.push(Z.replace(ee, '&').replace(b, '&'));
                  }),
                  k.walkAtRules((Q) => {
                    M.push(`@${Q.name} (${Q.params}) { & }`);
                  }));
                let I = !(x in (h.values ?? {}));
                (P = P.map((Q) =>
                  Q.map((Z) => ({ format: Z, isArbitraryVariant: I }))
                )),
                  (M = M.map((Q) => ({ format: Q, isArbitraryVariant: I })));
                let X = { candidate: b, context: e },
                  ge = P.map((Q) =>
                    dn(`.${b}`, Nt(Q, X), X)
                      .replace(`.${b}`, '&')
                      .replace('{ & }', '')
                      .trim()
                  );
                return (
                  M.length > 0 &&
                    ge.push(Nt(M, X).toString().replace(`.${b}`, '&')),
                  ge
                );
              },
            });
        return p;
      });
  }
  function Od(r, e) {
    !r.classCache.has(e) ||
      (r.notClassCache.add(e),
      r.classCache.delete(e),
      r.applyClassCache.delete(e),
      r.candidateRuleMap.delete(e),
      r.candidateRuleCache.delete(e),
      (r.stylesheetCache = null));
  }
  function y2(r, e) {
    let t = e.raws.tailwind.candidate;
    if (!!t) {
      for (let i of r.ruleCache)
        i[1].raws.tailwind.candidate === t && r.ruleCache.delete(i);
      Od(r, t);
    }
  }
  function ao(r, e = [], t = j.root()) {
    let i = {
        disposables: [],
        ruleCache: new Set(),
        candidateRuleCache: new Map(),
        classCache: new Map(),
        applyClassCache: new Map(),
        notClassCache: new Set(r.blocklist ?? []),
        postCssNodeCache: new Map(),
        candidateRuleMap: new Map(),
        tailwindConfig: r,
        changedContent: e,
        variantMap: new Map(),
        stylesheetCache: null,
        variantOptions: new Map(),
        markInvalidUtilityCandidate: (s) => Od(i, s),
        markInvalidUtilityNode: (s) => y2(i, s),
      },
      n = m2(i, t);
    return g2(n, i), i;
  }
  function Ed(r, e, t, i, n, s) {
    let a = e.opts.from,
      o = i !== null;
    Pe.DEBUG && console.log('Source path:', a);
    let u;
    if (o && Lt.has(a)) u = Lt.get(a);
    else if (Jr.has(n)) {
      let d = Jr.get(n);
      ot.get(d).add(a), Lt.set(a, d), (u = d);
    }
    let c = hd(a, r);
    if (u) {
      let [d, h] = Cd([...s], _n(u));
      if (!d && !c) return [u, !1, h];
    }
    if (Lt.has(a)) {
      let d = Lt.get(a);
      if (ot.has(d) && (ot.get(d).delete(a), ot.get(d).size === 0)) {
        ot.delete(d);
        for (let [h, y] of Jr) y === d && Jr.delete(h);
        for (let h of d.disposables.splice(0)) h(d);
      }
    }
    Pe.DEBUG && console.log('Setting up new context...');
    let f = ao(t, [], r);
    Object.assign(f, { userConfigPath: i });
    let [, p] = Cd([...s], _n(f));
    return (
      Jr.set(n, f),
      Lt.set(a, f),
      ot.has(f) || ot.set(f, new Set()),
      ot.get(f).add(a),
      [f, !0, p]
    );
  }
  var xd,
    to,
    ro,
    io,
    so,
    Lt,
    Jr,
    ot,
    xn = C(() => {
      l();
      je();
      fs();
      it();
      (xd = K(Is())), (to = K(Me()));
      Wr();
      Ma();
      nn();
      vt();
      Rt();
      Na();
      ur();
      td();
      at();
      at();
      oi();
      Oe();
      si();
      Va();
      wn();
      md();
      vd();
      De();
      Ya();
      (ro = {
        AddVariant: Symbol.for('ADD_VARIANT'),
        MatchVariant: Symbol.for('MATCH_VARIANT'),
      }),
        (io = { Base: 1 << 0, Dynamic: 1 << 1 });
      so = new WeakMap();
      (Lt = rd), (Jr = id), (ot = cn);
    });
  function oo(r) {
    return r.ignore
      ? []
      : r.glob
      ? m.env.ROLLUP_WATCH === 'true'
        ? [{ type: 'dependency', file: r.base }]
        : [{ type: 'dir-dependency', dir: r.base, glob: r.glob }]
      : [{ type: 'dependency', file: r.base }];
  }
  var Td = C(() => {
    l();
  });
  function Pd(r, e) {
    return { handler: r, config: e };
  }
  var Dd,
    Id = C(() => {
      l();
      Pd.withOptions = function (r, e = () => ({})) {
        let t = function (i) {
          return { __options: i, handler: r(i), config: e(i) };
        };
        return (
          (t.__isOptionsFunction = !0),
          (t.__pluginFunction = r),
          (t.__configFunction = e),
          t
        );
      };
      Dd = Pd;
    });
  var lo = {};
  Ce(lo, { default: () => b2 });
  var b2,
    uo = C(() => {
      l();
      Id();
      b2 = Dd;
    });
  var Rd = v((GP, qd) => {
    l();
    var w2 = (uo(), lo).default,
      v2 = {
        overflow: 'hidden',
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
      },
      x2 = w2(
        function ({
          matchUtilities: r,
          addUtilities: e,
          theme: t,
          variants: i,
        }) {
          let n = t('lineClamp');
          r(
            { 'line-clamp': (s) => ({ ...v2, '-webkit-line-clamp': `${s}` }) },
            { values: n }
          ),
            e(
              [{ '.line-clamp-none': { '-webkit-line-clamp': 'unset' } }],
              i('lineClamp')
            );
        },
        {
          theme: {
            lineClamp: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' },
          },
          variants: { lineClamp: ['responsive'] },
        }
      );
    qd.exports = x2;
  });
  function fo(r) {
    r.content.files.length === 0 &&
      N.warn('content-problems', [
        'The `content` option in your Tailwind CSS configuration is missing or empty.',
        'Configure your content sources or your generated CSS will be missing styles.',
        'https://tailwindcss.com/docs/content-configuration',
      ]);
    try {
      let e = Rd();
      r.plugins.includes(e) &&
        (N.warn('line-clamp-in-core', [
          'As of Tailwind CSS v3.3, the `@tailwindcss/line-clamp` plugin is now included by default.',
          'Remove it from the `plugins` array in your configuration to eliminate this warning.',
        ]),
        (r.plugins = r.plugins.filter((t) => t !== e)));
    } catch {}
    return r;
  }
  var Md = C(() => {
    l();
    Oe();
  });
  var Fd,
    Nd = C(() => {
      l();
      Fd = () => !1;
    });
  var Cn,
    Ld = C(() => {
      l();
      Cn = {
        sync: (r) => [].concat(r),
        generateTasks: (r) => [
          {
            dynamic: !1,
            base: '.',
            negative: [],
            positive: [].concat(r),
            patterns: [].concat(r),
          },
        ],
        escapePath: (r) => r,
      };
    });
  var co,
    Bd = C(() => {
      l();
      co = (r) => r;
    });
  var $d,
    jd = C(() => {
      l();
      $d = () => '';
    });
  function zd(r) {
    let e = r,
      t = $d(r);
    return (
      t !== '.' &&
        ((e = r.substr(t.length)), e.charAt(0) === '/' && (e = e.substr(1))),
      e.substr(0, 2) === './' && (e = e.substr(2)),
      e.charAt(0) === '/' && (e = e.substr(1)),
      { base: t, glob: e }
    );
  }
  var Vd = C(() => {
    l();
    jd();
  });
  function Ud(r, e) {
    let t = e.content.files;
    (t = t.filter((o) => typeof o == 'string')), (t = t.map(co));
    let i = Cn.generateTasks(t),
      n = [],
      s = [];
    for (let o of i)
      n.push(...o.positive.map((u) => Wd(u, !1))),
        s.push(...o.negative.map((u) => Wd(u, !0)));
    let a = [...n, ...s];
    return (a = S2(r, a)), (a = a.flatMap(_2)), (a = a.map(k2)), a;
  }
  function Wd(r, e) {
    let t = { original: r, base: r, ignore: e, pattern: r, glob: null };
    return Fd(r) && Object.assign(t, zd(r)), t;
  }
  function k2(r) {
    let e = co(r.base);
    return (
      (e = Cn.escapePath(e)),
      (r.pattern = r.glob ? `${e}/${r.glob}` : e),
      (r.pattern = r.ignore ? `!${r.pattern}` : r.pattern),
      r
    );
  }
  function S2(r, e) {
    let t = [];
    return (
      r.userConfigPath &&
        r.tailwindConfig.content.relative &&
        (t = [te.dirname(r.userConfigPath)]),
      e.map((i) => ((i.base = te.resolve(...t, i.base)), i))
    );
  }
  function _2(r) {
    let e = [r];
    try {
      let t = ie.realpathSync(r.base);
      t !== r.base && e.push({ ...r, base: t });
    } catch {}
    return e;
  }
  function Gd(r, e, t) {
    let i = r.tailwindConfig.content.files
        .filter((a) => typeof a.raw == 'string')
        .map(({ raw: a, extension: o = 'html' }) => ({
          content: a,
          extension: o,
        })),
      [n, s] = C2(e, t);
    for (let a of n) {
      let o = te.extname(a).slice(1);
      i.push({ file: a, extension: o });
    }
    return [i, s];
  }
  function C2(r, e) {
    let t = r.map((a) => a.pattern),
      i = new Map(),
      n = new Set();
    Pe.DEBUG && console.time('Finding changed files');
    let s = Cn.sync(t, { absolute: !0 });
    for (let a of s) {
      let o = e.get(a) || -1 / 0,
        u = ie.statSync(a).mtimeMs;
      u > o && (n.add(a), i.set(a, u));
    }
    return Pe.DEBUG && console.timeEnd('Finding changed files'), [n, i];
  }
  var Hd = C(() => {
    l();
    je();
    dt();
    Nd();
    Ld();
    Bd();
    Vd();
    at();
  });
  function Yd() {}
  var Qd = C(() => {
    l();
  });
  function T2(r, e) {
    for (let t of e) {
      let i = `${r}${t}`;
      if (ie.existsSync(i) && ie.statSync(i).isFile()) return i;
    }
    for (let t of e) {
      let i = `${r}/index${t}`;
      if (ie.existsSync(i)) return i;
    }
    return null;
  }
  function* Jd(r, e, t, i = te.extname(r)) {
    let n = T2(te.resolve(e, r), A2.includes(i) ? O2 : E2);
    if (n === null || t.has(n)) return;
    t.add(n), yield n, (e = te.dirname(n)), (i = te.extname(n));
    let s = ie.readFileSync(n, 'utf-8');
    for (let a of [
      ...s.matchAll(/import[\s\S]*?['"](.{3,}?)['"]/gi),
      ...s.matchAll(/import[\s\S]*from[\s\S]*?['"](.{3,}?)['"]/gi),
      ...s.matchAll(/require\(['"`](.+)['"`]\)/gi),
    ])
      !a[1].startsWith('.') || (yield* Jd(a[1], e, t, i));
  }
  function po(r) {
    return r === null ? new Set() : new Set(Jd(r, te.dirname(r), new Set()));
  }
  var A2,
    O2,
    E2,
    Xd = C(() => {
      l();
      je();
      dt();
      (A2 = ['.js', '.cjs', '.mjs']),
        (O2 = [
          '',
          '.js',
          '.cjs',
          '.mjs',
          '.ts',
          '.cts',
          '.mts',
          '.jsx',
          '.tsx',
        ]),
        (E2 = [
          '',
          '.ts',
          '.cts',
          '.mts',
          '.tsx',
          '.js',
          '.cjs',
          '.mjs',
          '.jsx',
        ]);
    });
  function P2(r, e) {
    if (ho.has(r)) return ho.get(r);
    let t = Ud(r, e);
    return ho.set(r, t).get(r);
  }
  function D2(r) {
    let e = ls(r);
    if (e !== null) {
      let [i, n, s, a] = Zd.get(e) || [],
        o = po(e),
        u = !1,
        c = new Map();
      for (let d of o) {
        let h = ie.statSync(d).mtimeMs;
        c.set(d, h), (!a || !a.has(d) || h > a.get(d)) && (u = !0);
      }
      if (!u) return [i, e, n, s];
      for (let d of o) delete Yl.cache[d];
      let f = fo(cr(Yd(e))),
        p = ni(f);
      return Zd.set(e, [f, p, o, c]), [f, e, p, o];
    }
    let t = cr(r.config === void 0 ? r : r.config);
    return (t = fo(t)), [t, null, ni(t), []];
  }
  function mo(r) {
    return ({ tailwindDirectives: e, registerDependency: t }) =>
      (i, n) => {
        let [s, a, o, u] = D2(r),
          c = new Set(u);
        if (e.size > 0) {
          c.add(n.opts.from);
          for (let y of n.messages) y.type === 'dependency' && c.add(y.file);
        }
        let [f, , p] = Ed(i, n, s, a, o, c),
          d = _n(f),
          h = P2(f, s);
        if (e.size > 0) {
          for (let b of h) for (let w of oo(b)) t(w);
          let [y, x] = Gd(f, h, d);
          for (let b of y) f.changedContent.push(b);
          for (let [b, w] of x.entries()) p.set(b, w);
        }
        for (let y of u) t({ type: 'dependency', file: y });
        for (let [y, x] of p.entries()) d.set(y, x);
        return f;
      };
  }
  var Kd,
    Zd,
    ho,
    eh = C(() => {
      l();
      je();
      Kd = K(zn());
      Zl();
      os();
      Vu();
      xn();
      Td();
      Md();
      Hd();
      Qd();
      Xd();
      (Zd = new Kd.default({ maxSize: 100 })), (ho = new WeakMap());
    });
  function go(r) {
    let e = new Set(),
      t = new Set(),
      i = new Set();
    if (
      (r.walkAtRules((n) => {
        n.name === 'apply' && i.add(n),
          n.name === 'import' &&
            (n.params === '"tailwindcss/base"' ||
            n.params === "'tailwindcss/base'"
              ? ((n.name = 'tailwind'), (n.params = 'base'))
              : n.params === '"tailwindcss/components"' ||
                n.params === "'tailwindcss/components'"
              ? ((n.name = 'tailwind'), (n.params = 'components'))
              : n.params === '"tailwindcss/utilities"' ||
                n.params === "'tailwindcss/utilities'"
              ? ((n.name = 'tailwind'), (n.params = 'utilities'))
              : (n.params === '"tailwindcss/screens"' ||
                  n.params === "'tailwindcss/screens'" ||
                  n.params === '"tailwindcss/variants"' ||
                  n.params === "'tailwindcss/variants'") &&
                ((n.name = 'tailwind'), (n.params = 'variants'))),
          n.name === 'tailwind' &&
            (n.params === 'screens' && (n.params = 'variants'),
            e.add(n.params)),
          ['layer', 'responsive', 'variants'].includes(n.name) &&
            (['responsive', 'variants'].includes(n.name) &&
              N.warn(`${n.name}-at-rule-deprecated`, [
                `The \`@${n.name}\` directive has been deprecated in Tailwind CSS v3.0.`,
                'Use `@layer utilities` or `@layer components` instead.',
                'https://tailwindcss.com/docs/upgrade-guide#replace-variants-with-layer',
              ]),
            t.add(n));
      }),
      !e.has('base') || !e.has('components') || !e.has('utilities'))
    ) {
      for (let n of t)
        if (
          n.name === 'layer' &&
          ['base', 'components', 'utilities'].includes(n.params)
        ) {
          if (!e.has(n.params))
            throw n.error(
              `\`@layer ${n.params}\` is used but no matching \`@tailwind ${n.params}\` directive is present.`
            );
        } else if (n.name === 'responsive') {
          if (!e.has('utilities'))
            throw n.error(
              '`@responsive` is used but `@tailwind utilities` is missing.'
            );
        } else if (n.name === 'variants' && !e.has('utilities'))
          throw n.error(
            '`@variants` is used but `@tailwind utilities` is missing.'
          );
    }
    return { tailwindDirectives: e, applyDirectives: i };
  }
  var th = C(() => {
    l();
    Oe();
  });
  function yt(r, e = void 0, t = void 0) {
    return r.map((i) => {
      let n = i.clone(),
        s = i.raws.tailwind?.preserveSource !== !0 || !n.source;
      return (
        e !== void 0 &&
          s &&
          ((n.source = e),
          'walk' in n &&
            n.walk((a) => {
              a.source = e;
            })),
        t !== void 0 && (n.raws.tailwind = { ...n.raws.tailwind, ...t }),
        n
      );
    });
  }
  var rh = C(() => {
    l();
  });
  function An(r) {
    return (
      (r = Array.isArray(r) ? r : [r]),
      (r = r.map((e) => (e instanceof RegExp ? e.source : e))),
      r.join('')
    );
  }
  function xe(r) {
    return new RegExp(An(r), 'g');
  }
  function Bt(r) {
    return `(?:${r.map(An).join('|')})`;
  }
  function yo(r) {
    return `(?:${An(r)})?`;
  }
  function nh(r) {
    return `(?:${An(r)})*`;
  }
  function sh(r) {
    return r && I2.test(r) ? r.replace(ih, '\\$&') : r || '';
  }
  var ih,
    I2,
    ah = C(() => {
      l();
      (ih = /[\\^$.*+?()[\]{}|]/g), (I2 = RegExp(ih.source));
    });
  function oh(r) {
    let e = Array.from(q2(r));
    return (t) => {
      let i = [];
      for (let n of e) i = [...i, ...(t.match(n) ?? [])];
      return i.filter((n) => n !== void 0).map(F2);
    };
  }
  function* q2(r) {
    let e = r.tailwindConfig.separator,
      t = J(r.tailwindConfig, 'variantGrouping'),
      i =
        r.tailwindConfig.prefix !== ''
          ? yo(xe([/-?/, sh(r.tailwindConfig.prefix)]))
          : '',
      n = Bt([
        /\[[^\s:'"`]+:[^\s\[\]]+\]/,
        /\[[^\s:'"`]+:[^\s]+?\[[^\s]+\][^\s]+?\]/,
        xe([
          /-?(?:\w+)/,
          yo(
            Bt([
              xe([
                /-(?:\w+-)*\[[^\s:]+\]/,
                /(?![{([]])/,
                /(?:\/[^\s'"`\\><$]*)?/,
              ]),
              xe([/-(?:\w+-)*\[[^\s]+\]/, /(?![{([]])/, /(?:\/[^\s'"`\\$]*)?/]),
              /[-\/][^\s'"`\\$={><]*/,
            ])
          ),
        ]),
      ]),
      s = [
        Bt([
          xe([/@\[[^\s"'`]+\](\/[^\s"'`]+)?/, e]),
          xe([/([^\s"'`\[\\]+-)?\[[^\s"'`]+\]/, e]),
          xe([/[^\s"'`\[\\]+/, e]),
        ]),
        Bt([xe([/([^\s"'`\[\\]+-)?\[[^\s`]+\]/, e]), xe([/[^\s`\[\\]+/, e])]),
      ];
    for (let a of s)
      yield xe([
        '((?=((',
        a,
        ')+))\\2)?',
        /!?/,
        i,
        t ? Bt([xe([/\(/, n, nh([/,/, n]), /\)/]), n]) : n,
      ]);
    yield /[^<>"'`\s.(){}[\]#=%$]*[^<>"'`\s.(){}[\]#=%:$]/g;
  }
  function F2(r) {
    if (!r.includes('-[')) return r;
    let e = 0,
      t = [],
      i = r.matchAll(R2);
    i = Array.from(i).flatMap((n) => {
      let [, ...s] = n;
      return s.map((a, o) =>
        Object.assign([], n, { index: n.index + o, 0: a })
      );
    });
    for (let n of i) {
      let s = n[0],
        a = t[t.length - 1];
      if (
        (s === a ? t.pop() : (s === "'" || s === '"' || s === '`') && t.push(s),
        !a)
      ) {
        if (s === '[') {
          e++;
          continue;
        } else if (s === ']') {
          e--;
          continue;
        }
        if (e < 0) return r.substring(0, n.index - 1);
        if (e === 0 && !M2.test(s)) return r.substring(0, n.index);
      }
    }
    return r;
  }
  var R2,
    M2,
    lh = C(() => {
      l();
      De();
      ah();
      (R2 = /([\[\]'"`])([^\[\]'"`])?/g), (M2 = /[^"'`\s<>\]]+/);
    });
  function N2(r, e) {
    let t = r.tailwindConfig.content.extract;
    return t[e] || t.DEFAULT || fh[e] || fh.DEFAULT(r);
  }
  function L2(r, e) {
    let t = r.content.transform;
    return t[e] || t.DEFAULT || ch[e] || ch.DEFAULT;
  }
  function B2(r, e, t, i) {
    Xr.has(e) || Xr.set(e, new uh.default({ maxSize: 25e3 }));
    for (let n of r.split(`
`))
      if (((n = n.trim()), !i.has(n)))
        if ((i.add(n), Xr.get(e).has(n)))
          for (let s of Xr.get(e).get(n)) t.add(s);
        else {
          let s = e(n).filter((o) => o !== '!*'),
            a = new Set(s);
          for (let o of a) t.add(o);
          Xr.get(e).set(n, a);
        }
  }
  function $2(r, e) {
    let t = e.offsets.sort(r),
      i = {
        base: new Set(),
        defaults: new Set(),
        components: new Set(),
        utilities: new Set(),
        variants: new Set(),
      };
    for (let [n, s] of t) i[n.layer].add(s);
    return i;
  }
  function bo(r) {
    return (e) => {
      let t = { base: null, components: null, utilities: null, variants: null };
      if (
        (e.walkAtRules((y) => {
          y.name === 'tailwind' &&
            Object.keys(t).includes(y.params) &&
            (t[y.params] = y);
        }),
        Object.values(t).every((y) => y === null))
      )
        return e;
      let i = new Set([...(r.candidates ?? []), Ge]),
        n = new Set();
      He.DEBUG && console.time('Reading changed files');
      for (let { file: y, content: x, extension: b } of r.changedContent) {
        let w = L2(r.tailwindConfig, b),
          k = N2(r, b);
        (x = y ? ie.readFileSync(y, 'utf8') : x), B2(w(x), k, i, n);
      }
      He.DEBUG && console.timeEnd('Reading changed files');
      let s = r.classCache.size;
      He.DEBUG && console.time('Generate rules'),
        He.DEBUG && console.time('Sorting candidates');
      let a = new Set([...i].sort((y, x) => (y === x ? 0 : y < x ? -1 : 1)));
      He.DEBUG && console.timeEnd('Sorting candidates'),
        bn(a, r),
        He.DEBUG && console.timeEnd('Generate rules'),
        He.DEBUG && console.time('Build stylesheet'),
        (r.stylesheetCache === null || r.classCache.size !== s) &&
          (r.stylesheetCache = $2([...r.ruleCache], r)),
        He.DEBUG && console.timeEnd('Build stylesheet');
      let {
        defaults: o,
        base: u,
        components: c,
        utilities: f,
        variants: p,
      } = r.stylesheetCache;
      t.base &&
        (t.base.before(yt([...u, ...o], t.base.source, { layer: 'base' })),
        t.base.remove()),
        t.components &&
          (t.components.before(
            yt([...c], t.components.source, { layer: 'components' })
          ),
          t.components.remove()),
        t.utilities &&
          (t.utilities.before(
            yt([...f], t.utilities.source, { layer: 'utilities' })
          ),
          t.utilities.remove());
      let d = Array.from(p).filter((y) => {
        let x = y.raws.tailwind?.parentLayer;
        return x === 'components'
          ? t.components !== null
          : x === 'utilities'
          ? t.utilities !== null
          : !0;
      });
      t.variants
        ? (t.variants.before(yt(d, t.variants.source, { layer: 'variants' })),
          t.variants.remove())
        : d.length > 0 && e.append(yt(d, e.source, { layer: 'variants' }));
      let h = d.some((y) => y.raws.tailwind?.parentLayer === 'utilities');
      t.utilities &&
        f.size === 0 &&
        !h &&
        N.warn('content-problems', [
          'No utility classes were detected in your source files. If this is unexpected, double-check the `content` option in your Tailwind CSS configuration.',
          'https://tailwindcss.com/docs/content-configuration',
        ]),
        He.DEBUG &&
          (console.log('Potential classes: ', i.size),
          console.log('Active contexts: ', cn.size)),
        (r.changedContent = []),
        e.walkAtRules('layer', (y) => {
          Object.keys(t).includes(y.params) && y.remove();
        });
    };
  }
  var uh,
    He,
    fh,
    ch,
    Xr,
    ph = C(() => {
      l();
      je();
      uh = K(zn());
      at();
      wn();
      Oe();
      rh();
      lh();
      (He = Pe),
        (fh = { DEFAULT: oh }),
        (ch = {
          DEFAULT: (r) => r,
          svelte: (r) => r.replace(/(?:^|\s)class:/g, ' '),
        });
      Xr = new WeakMap();
    });
  function En(r) {
    let e = new Map();
    j.root({ nodes: [r.clone()] }).walkRules((s) => {
      (0, On.default)((a) => {
        a.walkClasses((o) => {
          let u = o.parent.toString(),
            c = e.get(u);
          c || e.set(u, (c = new Set())), c.add(o.value);
        });
      }).processSync(s.selector);
    });
    let i = Array.from(e.values(), (s) => Array.from(s)),
      n = i.flat();
    return Object.assign(n, { groups: i });
  }
  function wo(r) {
    return j2.astSync(r);
  }
  function dh(r, e) {
    let t = new Set();
    for (let i of r) t.add(i.split(e).pop());
    return Array.from(t);
  }
  function hh(r, e) {
    let t = r.tailwindConfig.prefix;
    return typeof t == 'function' ? t(e) : t + e;
  }
  function* mh(r) {
    for (yield r; r.parent; ) yield r.parent, (r = r.parent);
  }
  function z2(r, e = {}) {
    let t = r.nodes;
    r.nodes = [];
    let i = r.clone(e);
    return (r.nodes = t), i;
  }
  function V2(r) {
    for (let e of mh(r))
      if (r !== e) {
        if (e.type === 'root') break;
        r = z2(e, { nodes: [r] });
      }
    return r;
  }
  function U2(r, e) {
    let t = new Map();
    return (
      r.walkRules((i) => {
        for (let a of mh(i)) if (a.raws.tailwind?.layer !== void 0) return;
        let n = V2(i),
          s = e.offsets.create('user');
        for (let a of En(i)) {
          let o = t.get(a) || [];
          t.set(a, o), o.push([{ layer: 'user', sort: s, important: !1 }, n]);
        }
      }),
      t
    );
  }
  function W2(r, e) {
    for (let t of r) {
      if (e.notClassCache.has(t) || e.applyClassCache.has(t)) continue;
      if (e.classCache.has(t)) {
        e.applyClassCache.set(
          t,
          e.classCache.get(t).map(([n, s]) => [n, s.clone()])
        );
        continue;
      }
      let i = Array.from(gn(t, e));
      if (i.length === 0) {
        e.notClassCache.add(t);
        continue;
      }
      e.applyClassCache.set(t, i);
    }
    return e.applyClassCache;
  }
  function G2(r) {
    let e = null;
    return {
      get: (t) => ((e = e || r()), e.get(t)),
      has: (t) => ((e = e || r()), e.has(t)),
    };
  }
  function H2(r) {
    return {
      get: (e) => r.flatMap((t) => t.get(e) || []),
      has: (e) => r.some((t) => t.has(e)),
    };
  }
  function gh(r) {
    let e = r.split(/[\s\t\n]+/g);
    return e[e.length - 1] === '!important' ? [e.slice(0, -1), !0] : [e, !1];
  }
  function yh(r, e, t) {
    let i = new Set(),
      n = [];
    if (
      (r.walkAtRules('apply', (u) => {
        let [c] = gh(u.params);
        for (let f of c) i.add(f);
        n.push(u);
      }),
      n.length === 0)
    )
      return;
    let s = H2([t, W2(i, e)]);
    function a(u, c, f) {
      let p = wo(u),
        d = wo(c),
        y = wo(`.${ce(f)}`).nodes[0].nodes[0];
      return (
        p.each((x) => {
          let b = new Set();
          d.each((w) => {
            let k = !1;
            (w = w.clone()),
              w.walkClasses((S) => {
                S.value === y.value &&
                  (k ||
                    (S.replaceWith(...x.nodes.map((_) => _.clone())),
                    b.add(w),
                    (k = !0)));
              });
          });
          for (let w of b) {
            let k = [[]];
            for (let S of w.nodes)
              S.type === 'combinator'
                ? (k.push(S), k.push([]))
                : k[k.length - 1].push(S);
            w.nodes = [];
            for (let S of k)
              Array.isArray(S) &&
                S.sort((_, P) =>
                  _.type === 'tag' && P.type === 'class'
                    ? -1
                    : _.type === 'class' && P.type === 'tag'
                    ? 1
                    : _.type === 'class' &&
                      P.type === 'pseudo' &&
                      P.value.startsWith('::')
                    ? -1
                    : _.type === 'pseudo' &&
                      _.value.startsWith('::') &&
                      P.type === 'class'
                    ? 1
                    : 0
                ),
                (w.nodes = w.nodes.concat(S));
          }
          x.replaceWith(...b);
        }),
        p.toString()
      );
    }
    let o = new Map();
    for (let u of n) {
      let [c] = o.get(u.parent) || [[], u.source];
      o.set(u.parent, [c, u.source]);
      let [f, p] = gh(u.params);
      if (u.parent.type === 'atrule') {
        if (u.parent.name === 'screen') {
          let d = u.parent.params;
          throw u.error(
            `@apply is not supported within nested at-rules like @screen. We suggest you write this as @apply ${f
              .map((h) => `${d}:${h}`)
              .join(' ')} instead.`
          );
        }
        throw u.error(
          `@apply is not supported within nested at-rules like @${u.parent.name}. You can fix this by un-nesting @${u.parent.name}.`
        );
      }
      for (let d of f) {
        if ([hh(e, 'group'), hh(e, 'peer')].includes(d))
          throw u.error(`@apply should not be used with the '${d}' utility`);
        if (!s.has(d))
          throw u.error(
            `The \`${d}\` class does not exist. If \`${d}\` is a custom class, make sure it is defined within a \`@layer\` directive.`
          );
        let h = s.get(d);
        c.push([d, p, h]);
      }
    }
    for (let [u, [c, f]] of o) {
      let p = [];
      for (let [h, y, x] of c) {
        let b = [h, ...dh([h], e.tailwindConfig.separator)];
        for (let [w, k] of x) {
          let S = En(u),
            _ = En(k);
          if (
            ((_ = _.groups.filter((I) => I.some((X) => b.includes(X))).flat()),
            (_ = _.concat(dh(_, e.tailwindConfig.separator))),
            S.some((I) => _.includes(I)))
          )
            throw k.error(
              `You cannot \`@apply\` the \`${h}\` utility here because it creates a circular dependency.`
            );
          let M = j.root({ nodes: [k.clone()] });
          M.walk((I) => {
            I.source = f;
          }),
            (k.type !== 'atrule' ||
              (k.type === 'atrule' && k.name !== 'keyframes')) &&
              M.walkRules((I) => {
                if (!En(I).some((ee) => ee === h)) {
                  I.remove();
                  return;
                }
                let X =
                    typeof e.tailwindConfig.important == 'string'
                      ? e.tailwindConfig.important
                      : null,
                  Q =
                    u.raws.tailwind !== void 0 &&
                    X &&
                    u.selector.indexOf(X) === 0
                      ? u.selector.slice(X.length)
                      : u.selector;
                (I.selector = a(Q, I.selector, h)),
                  X && Q !== u.selector && (I.selector = hn(I.selector, X)),
                  I.walkDecls((ee) => {
                    ee.important = w.important || y;
                  });
                let Z = (0, On.default)().astSync(I.selector);
                Z.each((ee) => Ft(ee)), (I.selector = Z.toString());
              }),
            !!M.nodes[0] && p.push([w.sort, M.nodes[0]]);
        }
      }
      let d = e.offsets.sort(p).map((h) => h[1]);
      u.after(d);
    }
    for (let u of n) u.parent.nodes.length > 1 ? u.remove() : u.parent.remove();
    yh(r, e, t);
  }
  function vo(r) {
    return (e) => {
      let t = G2(() => U2(e, r));
      yh(e, r, t);
    };
  }
  var On,
    j2,
    bh = C(() => {
      l();
      it();
      On = K(Me());
      wn();
      Rt();
      Ja();
      pn();
      j2 = (0, On.default)();
    });
  var wh = v((U3, Tn) => {
    l();
    (function () {
      'use strict';
      function r(i, n, s) {
        if (!i) return null;
        r.caseSensitive || (i = i.toLowerCase());
        var a = r.threshold === null ? null : r.threshold * i.length,
          o = r.thresholdAbsolute,
          u;
        a !== null && o !== null
          ? (u = Math.min(a, o))
          : a !== null
          ? (u = a)
          : o !== null
          ? (u = o)
          : (u = null);
        var c,
          f,
          p,
          d,
          h,
          y = n.length;
        for (h = 0; h < y; h++)
          if (
            ((f = n[h]),
            s && (f = f[s]),
            !!f &&
              (r.caseSensitive ? (p = f) : (p = f.toLowerCase()),
              (d = t(i, p, u)),
              (u === null || d < u) &&
                ((u = d),
                s && r.returnWinningObject ? (c = n[h]) : (c = f),
                r.returnFirstMatch)))
          )
            return c;
        return c || r.nullResultValue;
      }
      (r.threshold = 0.4),
        (r.thresholdAbsolute = 20),
        (r.caseSensitive = !1),
        (r.nullResultValue = null),
        (r.returnWinningObject = null),
        (r.returnFirstMatch = !1),
        typeof Tn != 'undefined' && Tn.exports
          ? (Tn.exports = r)
          : (window.didYouMean = r);
      var e = Math.pow(2, 32) - 1;
      function t(i, n, s) {
        s = s || s === 0 ? s : e;
        var a = i.length,
          o = n.length;
        if (a === 0) return Math.min(s + 1, o);
        if (o === 0) return Math.min(s + 1, a);
        if (Math.abs(a - o) > s) return s + 1;
        var u = [],
          c,
          f,
          p,
          d,
          h;
        for (c = 0; c <= o; c++) u[c] = [c];
        for (f = 0; f <= a; f++) u[0][f] = f;
        for (c = 1; c <= o; c++) {
          for (
            p = e,
              d = 1,
              c > s && (d = c - s),
              h = o + 1,
              h > s + c && (h = s + c),
              f = 1;
            f <= a;
            f++
          )
            f < d || f > h
              ? (u[c][f] = s + 1)
              : n.charAt(c - 1) === i.charAt(f - 1)
              ? (u[c][f] = u[c - 1][f - 1])
              : (u[c][f] = Math.min(
                  u[c - 1][f - 1] + 1,
                  Math.min(u[c][f - 1] + 1, u[c - 1][f] + 1)
                )),
              u[c][f] < p && (p = u[c][f]);
          if (p > s) return s + 1;
        }
        return u[o][a];
      }
    })();
  });
  var xh = v((W3, vh) => {
    l();
    var xo = '('.charCodeAt(0),
      ko = ')'.charCodeAt(0),
      Pn = "'".charCodeAt(0),
      So = '"'.charCodeAt(0),
      _o = '\\'.charCodeAt(0),
      $t = '/'.charCodeAt(0),
      Co = ','.charCodeAt(0),
      Ao = ':'.charCodeAt(0),
      Dn = '*'.charCodeAt(0),
      Y2 = 'u'.charCodeAt(0),
      Q2 = 'U'.charCodeAt(0),
      J2 = '+'.charCodeAt(0),
      X2 = /^[a-f0-9?-]+$/i;
    vh.exports = function (r) {
      for (
        var e = [],
          t = r,
          i,
          n,
          s,
          a,
          o,
          u,
          c,
          f,
          p = 0,
          d = t.charCodeAt(p),
          h = t.length,
          y = [{ nodes: e }],
          x = 0,
          b,
          w = '',
          k = '',
          S = '';
        p < h;

      )
        if (d <= 32) {
          i = p;
          do (i += 1), (d = t.charCodeAt(i));
          while (d <= 32);
          (a = t.slice(p, i)),
            (s = e[e.length - 1]),
            d === ko && x
              ? (S = a)
              : s && s.type === 'div'
              ? ((s.after = a), (s.sourceEndIndex += a.length))
              : d === Co ||
                d === Ao ||
                (d === $t &&
                  t.charCodeAt(i + 1) !== Dn &&
                  (!b || (b && b.type === 'function' && b.value !== 'calc')))
              ? (k = a)
              : e.push({
                  type: 'space',
                  sourceIndex: p,
                  sourceEndIndex: i,
                  value: a,
                }),
            (p = i);
        } else if (d === Pn || d === So) {
          (i = p),
            (n = d === Pn ? "'" : '"'),
            (a = { type: 'string', sourceIndex: p, quote: n });
          do
            if (((o = !1), (i = t.indexOf(n, i + 1)), ~i))
              for (u = i; t.charCodeAt(u - 1) === _o; ) (u -= 1), (o = !o);
            else (t += n), (i = t.length - 1), (a.unclosed = !0);
          while (o);
          (a.value = t.slice(p + 1, i)),
            (a.sourceEndIndex = a.unclosed ? i : i + 1),
            e.push(a),
            (p = i + 1),
            (d = t.charCodeAt(p));
        } else if (d === $t && t.charCodeAt(p + 1) === Dn)
          (i = t.indexOf('*/', p)),
            (a = { type: 'comment', sourceIndex: p, sourceEndIndex: i + 2 }),
            i === -1 &&
              ((a.unclosed = !0), (i = t.length), (a.sourceEndIndex = i)),
            (a.value = t.slice(p + 2, i)),
            e.push(a),
            (p = i + 2),
            (d = t.charCodeAt(p));
        else if (
          (d === $t || d === Dn) &&
          b &&
          b.type === 'function' &&
          b.value === 'calc'
        )
          (a = t[p]),
            e.push({
              type: 'word',
              sourceIndex: p - k.length,
              sourceEndIndex: p + a.length,
              value: a,
            }),
            (p += 1),
            (d = t.charCodeAt(p));
        else if (d === $t || d === Co || d === Ao)
          (a = t[p]),
            e.push({
              type: 'div',
              sourceIndex: p - k.length,
              sourceEndIndex: p + a.length,
              value: a,
              before: k,
              after: '',
            }),
            (k = ''),
            (p += 1),
            (d = t.charCodeAt(p));
        else if (xo === d) {
          i = p;
          do (i += 1), (d = t.charCodeAt(i));
          while (d <= 32);
          if (
            ((f = p),
            (a = {
              type: 'function',
              sourceIndex: p - w.length,
              value: w,
              before: t.slice(f + 1, i),
            }),
            (p = i),
            w === 'url' && d !== Pn && d !== So)
          ) {
            i -= 1;
            do
              if (((o = !1), (i = t.indexOf(')', i + 1)), ~i))
                for (u = i; t.charCodeAt(u - 1) === _o; ) (u -= 1), (o = !o);
              else (t += ')'), (i = t.length - 1), (a.unclosed = !0);
            while (o);
            c = i;
            do (c -= 1), (d = t.charCodeAt(c));
            while (d <= 32);
            f < c
              ? (p !== c + 1
                  ? (a.nodes = [
                      {
                        type: 'word',
                        sourceIndex: p,
                        sourceEndIndex: c + 1,
                        value: t.slice(p, c + 1),
                      },
                    ])
                  : (a.nodes = []),
                a.unclosed && c + 1 !== i
                  ? ((a.after = ''),
                    a.nodes.push({
                      type: 'space',
                      sourceIndex: c + 1,
                      sourceEndIndex: i,
                      value: t.slice(c + 1, i),
                    }))
                  : ((a.after = t.slice(c + 1, i)), (a.sourceEndIndex = i)))
              : ((a.after = ''), (a.nodes = [])),
              (p = i + 1),
              (a.sourceEndIndex = a.unclosed ? i : p),
              (d = t.charCodeAt(p)),
              e.push(a);
          } else
            (x += 1),
              (a.after = ''),
              (a.sourceEndIndex = p + 1),
              e.push(a),
              y.push(a),
              (e = a.nodes = []),
              (b = a);
          w = '';
        } else if (ko === d && x)
          (p += 1),
            (d = t.charCodeAt(p)),
            (b.after = S),
            (b.sourceEndIndex += S.length),
            (S = ''),
            (x -= 1),
            (y[y.length - 1].sourceEndIndex = p),
            y.pop(),
            (b = y[x]),
            (e = b.nodes);
        else {
          i = p;
          do d === _o && (i += 1), (i += 1), (d = t.charCodeAt(i));
          while (
            i < h &&
            !(
              d <= 32 ||
              d === Pn ||
              d === So ||
              d === Co ||
              d === Ao ||
              d === $t ||
              d === xo ||
              (d === Dn && b && b.type === 'function' && b.value === 'calc') ||
              (d === $t && b.type === 'function' && b.value === 'calc') ||
              (d === ko && x)
            )
          );
          (a = t.slice(p, i)),
            xo === d
              ? (w = a)
              : (Y2 === a.charCodeAt(0) || Q2 === a.charCodeAt(0)) &&
                J2 === a.charCodeAt(1) &&
                X2.test(a.slice(2))
              ? e.push({
                  type: 'unicode-range',
                  sourceIndex: p,
                  sourceEndIndex: i,
                  value: a,
                })
              : e.push({
                  type: 'word',
                  sourceIndex: p,
                  sourceEndIndex: i,
                  value: a,
                }),
            (p = i);
        }
      for (p = y.length - 1; p; p -= 1)
        (y[p].unclosed = !0), (y[p].sourceEndIndex = t.length);
      return y[0].nodes;
    };
  });
  var Sh = v((G3, kh) => {
    l();
    kh.exports = function r(e, t, i) {
      var n, s, a, o;
      for (n = 0, s = e.length; n < s; n += 1)
        (a = e[n]),
          i || (o = t(a, n, e)),
          o !== !1 &&
            a.type === 'function' &&
            Array.isArray(a.nodes) &&
            r(a.nodes, t, i),
          i && t(a, n, e);
    };
  });
  var Oh = v((H3, Ah) => {
    l();
    function _h(r, e) {
      var t = r.type,
        i = r.value,
        n,
        s;
      return e && (s = e(r)) !== void 0
        ? s
        : t === 'word' || t === 'space'
        ? i
        : t === 'string'
        ? ((n = r.quote || ''), n + i + (r.unclosed ? '' : n))
        : t === 'comment'
        ? '/*' + i + (r.unclosed ? '' : '*/')
        : t === 'div'
        ? (r.before || '') + i + (r.after || '')
        : Array.isArray(r.nodes)
        ? ((n = Ch(r.nodes, e)),
          t !== 'function'
            ? n
            : i +
              '(' +
              (r.before || '') +
              n +
              (r.after || '') +
              (r.unclosed ? '' : ')'))
        : i;
    }
    function Ch(r, e) {
      var t, i;
      if (Array.isArray(r)) {
        for (t = '', i = r.length - 1; ~i; i -= 1) t = _h(r[i], e) + t;
        return t;
      }
      return _h(r, e);
    }
    Ah.exports = Ch;
  });
  var Th = v((Y3, Eh) => {
    l();
    var In = '-'.charCodeAt(0),
      qn = '+'.charCodeAt(0),
      Oo = '.'.charCodeAt(0),
      K2 = 'e'.charCodeAt(0),
      Z2 = 'E'.charCodeAt(0);
    function e_(r) {
      var e = r.charCodeAt(0),
        t;
      if (e === qn || e === In) {
        if (((t = r.charCodeAt(1)), t >= 48 && t <= 57)) return !0;
        var i = r.charCodeAt(2);
        return t === Oo && i >= 48 && i <= 57;
      }
      return e === Oo
        ? ((t = r.charCodeAt(1)), t >= 48 && t <= 57)
        : e >= 48 && e <= 57;
    }
    Eh.exports = function (r) {
      var e = 0,
        t = r.length,
        i,
        n,
        s;
      if (t === 0 || !e_(r)) return !1;
      for (
        i = r.charCodeAt(e), (i === qn || i === In) && e++;
        e < t && ((i = r.charCodeAt(e)), !(i < 48 || i > 57));

      )
        e += 1;
      if (
        ((i = r.charCodeAt(e)),
        (n = r.charCodeAt(e + 1)),
        i === Oo && n >= 48 && n <= 57)
      )
        for (e += 2; e < t && ((i = r.charCodeAt(e)), !(i < 48 || i > 57)); )
          e += 1;
      if (
        ((i = r.charCodeAt(e)),
        (n = r.charCodeAt(e + 1)),
        (s = r.charCodeAt(e + 2)),
        (i === K2 || i === Z2) &&
          ((n >= 48 && n <= 57) ||
            ((n === qn || n === In) && s >= 48 && s <= 57)))
      )
        for (
          e += n === qn || n === In ? 3 : 2;
          e < t && ((i = r.charCodeAt(e)), !(i < 48 || i > 57));

        )
          e += 1;
      return { number: r.slice(0, e), unit: r.slice(e) };
    };
  });
  var Kr = v((Q3, Ih) => {
    l();
    var t_ = xh(),
      Ph = Sh(),
      Dh = Oh();
    function lt(r) {
      return this instanceof lt ? ((this.nodes = t_(r)), this) : new lt(r);
    }
    lt.prototype.toString = function () {
      return Array.isArray(this.nodes) ? Dh(this.nodes) : '';
    };
    lt.prototype.walk = function (r, e) {
      return Ph(this.nodes, r, e), this;
    };
    lt.unit = Th();
    lt.walk = Ph;
    lt.stringify = Dh;
    Ih.exports = lt;
  });
  function To(r) {
    return typeof r == 'object' && r !== null;
  }
  function r_(r, e) {
    let t = Xe(e);
    do if ((t.pop(), (0, Zr.default)(r, t) !== void 0)) break;
    while (t.length);
    return t.length ? t : void 0;
  }
  function jt(r) {
    return typeof r == 'string'
      ? r
      : r.reduce(
          (e, t, i) =>
            t.includes('.') ? `${e}[${t}]` : i === 0 ? t : `${e}.${t}`,
          ''
        );
  }
  function Rh(r) {
    return r.map((e) => `'${e}'`).join(', ');
  }
  function Mh(r) {
    return Rh(Object.keys(r));
  }
  function Po(r, e, t, i = {}) {
    let n = Array.isArray(e) ? jt(e) : e.replace(/^['"]+|['"]+$/g, ''),
      s = Array.isArray(e) ? e : Xe(n),
      a = (0, Zr.default)(r.theme, s, t);
    if (a === void 0) {
      let u = `'${n}' does not exist in your theme config.`,
        c = s.slice(0, -1),
        f = (0, Zr.default)(r.theme, c);
      if (To(f)) {
        let p = Object.keys(f).filter((h) => Po(r, [...c, h]).isValid),
          d = (0, qh.default)(s[s.length - 1], p);
        d
          ? (u += ` Did you mean '${jt([...c, d])}'?`)
          : p.length > 0 &&
            (u += ` '${jt(c)}' has the following valid keys: ${Rh(p)}`);
      } else {
        let p = r_(r.theme, n);
        if (p) {
          let d = (0, Zr.default)(r.theme, p);
          To(d)
            ? (u += ` '${jt(p)}' has the following keys: ${Mh(d)}`)
            : (u += ` '${jt(p)}' is not an object.`);
        } else
          u += ` Your theme has the following top-level keys: ${Mh(r.theme)}`;
      }
      return { isValid: !1, error: u };
    }
    if (
      !(
        typeof a == 'string' ||
        typeof a == 'number' ||
        typeof a == 'function' ||
        a instanceof String ||
        a instanceof Number ||
        Array.isArray(a)
      )
    ) {
      let u = `'${n}' was found but does not resolve to a string.`;
      if (To(a)) {
        let c = Object.keys(a).filter((f) => Po(r, [...s, f]).isValid);
        c.length &&
          (u += ` Did you mean something like '${jt([...s, c[0]])}'?`);
      }
      return { isValid: !1, error: u };
    }
    let [o] = s;
    return { isValid: !0, value: We(o)(a, i) };
  }
  function i_(r, e, t) {
    e = e.map((n) => Fh(r, n, t));
    let i = [''];
    for (let n of e)
      n.type === 'div' && n.value === ','
        ? i.push('')
        : (i[i.length - 1] += Eo.default.stringify(n));
    return i;
  }
  function Fh(r, e, t) {
    if (e.type === 'function' && t[e.value] !== void 0) {
      let i = i_(r, e.nodes, t);
      (e.type = 'word'), (e.value = t[e.value](r, ...i));
    }
    return e;
  }
  function n_(r, e, t) {
    return (0, Eo.default)(e)
      .walk((i) => {
        Fh(r, i, t);
      })
      .toString();
  }
  function* a_(r) {
    r = r.replace(/^['"]+|['"]+$/g, '');
    let e = r.match(/^([^\s]+)(?![^\[]*\])(?:\s*\/\s*([^\/\s]+))$/),
      t;
    yield [r, void 0], e && ((r = e[1]), (t = e[2]), yield [r, t]);
  }
  function o_(r, e, t) {
    let i = Array.from(a_(e)).map(([n, s]) =>
      Object.assign(Po(r, n, t, { opacityValue: s }), {
        resolvedPath: n,
        alpha: s,
      })
    );
    return i.find((n) => n.isValid) ?? i[0];
  }
  function Nh(r) {
    let e = r.tailwindConfig,
      t = {
        theme: (i, n, ...s) => {
          let {
            isValid: a,
            value: o,
            error: u,
            alpha: c,
          } = o_(e, n, s.length ? s : void 0);
          if (!a) {
            let d = i.parent,
              h = d?.raws.tailwind?.candidate;
            if (d && h !== void 0) {
              r.markInvalidUtilityNode(d),
                d.remove(),
                N.warn('invalid-theme-key-in-class', [
                  `The utility \`${h}\` contains an invalid theme value and was not generated.`,
                ]);
              return;
            }
            throw i.error(u);
          }
          let f = xt(o),
            p = f !== void 0 && typeof f == 'function';
          return (
            (c !== void 0 || p) && (c === void 0 && (c = 1), (o = Ie(f, c, f))),
            o
          );
        },
        screen: (i, n) => {
          n = n.replace(/^['"]+/g, '').replace(/['"]+$/g, '');
          let a = st(e.theme.screens).find(({ name: o }) => o === n);
          if (!a)
            throw i.error(`The '${n}' screen does not exist in your theme.`);
          return nt(a);
        },
      };
    return (i) => {
      i.walk((n) => {
        let s = s_[n.type];
        s !== void 0 && (n[s] = n_(n, n[s], t));
      });
    };
  }
  var Zr,
    qh,
    Eo,
    s_,
    Lh = C(() => {
      l();
      (Zr = K(Is())), (qh = K(wh()));
      Wr();
      Eo = K(Kr());
      un();
      an();
      oi();
      nr();
      ur();
      Oe();
      s_ = { atrule: 'params', decl: 'value' };
    });
  function Bh({ tailwindConfig: { theme: r } }) {
    return function (e) {
      e.walkAtRules('screen', (t) => {
        let i = t.params,
          s = st(r.screens).find(({ name: a }) => a === i);
        if (!s) throw t.error(`No \`${i}\` screen found.`);
        (t.name = 'media'), (t.params = nt(s));
      });
    };
  }
  var $h = C(() => {
    l();
    un();
    an();
  });
  function l_(r) {
    let e = r
        .filter((o) =>
          o.type !== 'pseudo' || o.nodes.length > 0
            ? !0
            : o.value.startsWith('::') ||
              [':before', ':after', ':first-line', ':first-letter'].includes(
                o.value
              )
        )
        .reverse(),
      t = new Set(['tag', 'class', 'id', 'attribute']),
      i = e.findIndex((o) => t.has(o.type));
    if (i === -1) return e.reverse().join('').trim();
    let n = e[i],
      s = jh[n.type] ? jh[n.type](n) : n;
    e = e.slice(0, i);
    let a = e.findIndex((o) => o.type === 'combinator' && o.value === '>');
    return (
      a !== -1 && (e.splice(0, a), e.unshift(Rn.default.universal())),
      [s, ...e.reverse()].join('').trim()
    );
  }
  function f_(r) {
    return Do.has(r) || Do.set(r, u_.transformSync(r)), Do.get(r);
  }
  function Io({ tailwindConfig: r }) {
    return (e) => {
      let t = new Map(),
        i = new Set();
      if (
        (e.walkAtRules('defaults', (n) => {
          if (n.nodes && n.nodes.length > 0) {
            i.add(n);
            return;
          }
          let s = n.params;
          t.has(s) || t.set(s, new Set()), t.get(s).add(n.parent), n.remove();
        }),
        J(r, 'optimizeUniversalDefaults'))
      )
        for (let n of i) {
          let s = new Map(),
            a = t.get(n.params) ?? [];
          for (let o of a)
            for (let u of f_(o.selector)) {
              let c = u.includes(':-') || u.includes('::-') ? u : '__DEFAULT__',
                f = s.get(c) ?? new Set();
              s.set(c, f), f.add(u);
            }
          if (J(r, 'optimizeUniversalDefaults')) {
            if (s.size === 0) {
              n.remove();
              continue;
            }
            for (let [, o] of s) {
              let u = j.rule({ source: n.source });
              (u.selectors = [...o]),
                u.append(n.nodes.map((c) => c.clone())),
                n.before(u);
            }
          }
          n.remove();
        }
      else if (i.size) {
        let n = j.rule({ selectors: ['*', '::before', '::after'] });
        for (let a of i)
          n.append(a.nodes),
            n.parent || a.before(n),
            n.source || (n.source = a.source),
            a.remove();
        let s = n.clone({ selectors: ['::backdrop'] });
        n.after(s);
      }
    };
  }
  var Rn,
    jh,
    u_,
    Do,
    zh = C(() => {
      l();
      it();
      Rn = K(Me());
      De();
      jh = {
        id(r) {
          return Rn.default.attribute({
            attribute: 'id',
            operator: '=',
            value: r.value,
            quoteMark: '"',
          });
        },
      };
      (u_ = (0, Rn.default)((r) =>
        r.map((e) => {
          let t = e
            .split((i) => i.type === 'combinator' && i.value === ' ')
            .pop();
          return l_(t);
        })
      )),
        (Do = new Map());
    });
  function qo() {
    function r(e) {
      let t = null;
      e.each((i) => {
        if (!c_.has(i.type)) {
          t = null;
          return;
        }
        if (t === null) {
          t = i;
          return;
        }
        let n = Vh[i.type];
        i.type === 'atrule' && i.name === 'font-face'
          ? (t = i)
          : n.every(
              (s) =>
                (i[s] ?? '').replace(/\s+/g, ' ') ===
                (t[s] ?? '').replace(/\s+/g, ' ')
            )
          ? (i.nodes && t.append(i.nodes), i.remove())
          : (t = i);
      }),
        e.each((i) => {
          i.type === 'atrule' && r(i);
        });
    }
    return (e) => {
      r(e);
    };
  }
  var Vh,
    c_,
    Uh = C(() => {
      l();
      (Vh = { atrule: ['name', 'params'], rule: ['selector'] }),
        (c_ = new Set(Object.keys(Vh)));
    });
  function Ro() {
    return (r) => {
      r.walkRules((e) => {
        let t = new Map(),
          i = new Set([]),
          n = new Map();
        e.walkDecls((s) => {
          if (s.parent === e) {
            if (t.has(s.prop)) {
              if (t.get(s.prop).value === s.value) {
                i.add(t.get(s.prop)), t.set(s.prop, s);
                return;
              }
              n.has(s.prop) || n.set(s.prop, new Set()),
                n.get(s.prop).add(t.get(s.prop)),
                n.get(s.prop).add(s);
            }
            t.set(s.prop, s);
          }
        });
        for (let s of i) s.remove();
        for (let s of n.values()) {
          let a = new Map();
          for (let o of s) {
            let u = d_(o.value);
            u !== null && (a.has(u) || a.set(u, new Set()), a.get(u).add(o));
          }
          for (let o of a.values()) {
            let u = Array.from(o).slice(0, -1);
            for (let c of u) c.remove();
          }
        }
      });
    };
  }
  function d_(r) {
    let e = /^-?\d*.?\d+([\w%]+)?$/g.exec(r);
    return e ? e[1] ?? p_ : null;
  }
  var p_,
    Wh = C(() => {
      l();
      p_ = Symbol('unitless-number');
    });
  function h_(r) {
    if (!r.walkAtRules) return;
    let e = new Set();
    if (
      (r.walkAtRules('apply', (t) => {
        e.add(t.parent);
      }),
      e.size !== 0)
    )
      for (let t of e) {
        let i = [],
          n = [];
        for (let s of t.nodes)
          s.type === 'atrule' && s.name === 'apply'
            ? (n.length > 0 && (i.push(n), (n = [])), i.push([s]))
            : n.push(s);
        if ((n.length > 0 && i.push(n), i.length !== 1)) {
          for (let s of [...i].reverse()) {
            let a = t.clone({ nodes: [] });
            a.append(s), t.after(a);
          }
          t.remove();
        }
      }
  }
  function Mn() {
    return (r) => {
      h_(r);
    };
  }
  var Gh = C(() => {
    l();
  });
  function m_(r) {
    return r.type === 'root';
  }
  function g_(r) {
    return r.type === 'atrule' && r.name === 'layer';
  }
  function Hh(r) {
    return (e, t) => {
      let i = !1;
      e.walkAtRules('tailwind', (n) => {
        if (i) return !1;
        if (n.parent && !(m_(n.parent) || g_(n.parent)))
          return (
            (i = !0),
            n.warn(
              t,
              [
                'Nested @tailwind rules were detected, but are not supported.',
                "Consider using a prefix to scope Tailwind's classes: https://tailwindcss.com/docs/configuration#prefix",
                'Alternatively, use the important selector strategy: https://tailwindcss.com/docs/configuration#selector-strategy',
              ].join(`
`)
            ),
            !1
          );
      }),
        e.walkRules((n) => {
          if (i) return !1;
          n.walkRules(
            (s) => (
              (i = !0),
              s.warn(
                t,
                [
                  'Nested CSS was detected, but CSS nesting has not been configured correctly.',
                  'Please enable a CSS nesting plugin *before* Tailwind in your configuration.',
                  'See how here: https://tailwindcss.com/docs/using-with-preprocessors#nesting',
                ].join(`
`)
              ),
              !1
            )
          );
        });
    };
  }
  var Yh = C(() => {
    l();
  });
  function Fn(r) {
    return function (e, t) {
      let { tailwindDirectives: i, applyDirectives: n } = go(e);
      Hh()(e, t), Mn()(e, t);
      let s = r({
        tailwindDirectives: i,
        applyDirectives: n,
        registerDependency(a) {
          t.messages.push({ plugin: 'tailwindcss', parent: t.opts.from, ...a });
        },
        createContext(a, o) {
          return ao(a, o, e);
        },
      })(e, t);
      if (s.tailwindConfig.separator === '-')
        throw new Error(
          "The '-' character cannot be used as a custom separator in JIT mode due to parsing ambiguity. Please use another character like '_' instead."
        );
      fu(s.tailwindConfig),
        bo(s)(e, t),
        Mn()(e, t),
        vo(s)(e, t),
        Nh(s)(e, t),
        Bh(s)(e, t),
        Io(s)(e, t),
        qo(s)(e, t),
        Ro(s)(e, t);
    };
  }
  var Qh = C(() => {
    l();
    th();
    ph();
    bh();
    Lh();
    $h();
    zh();
    Uh();
    Wh();
    Gh();
    Yh();
    xn();
    De();
  });
  function Jh(r, e) {
    let t = null,
      i = null;
    return (
      r.walkAtRules('config', (n) => {
        if (((i = n.source?.input.file ?? e.opts.from ?? null), i === null))
          throw n.error(
            'The `@config` directive cannot be used without setting `from` in your PostCSS config.'
          );
        if (t)
          throw n.error('Only one `@config` directive is allowed per file.');
        let s = n.params.match(/(['"])(.*?)\1/);
        if (!s)
          throw n.error(
            'A path is required when using the `@config` directive.'
          );
        let a = s[2];
        if (te.isAbsolute(a))
          throw n.error(
            'The `@config` directive cannot be used with an absolute path.'
          );
        if (((t = te.resolve(te.dirname(i), a)), !ie.existsSync(t)))
          throw n.error(
            `The config file at "${a}" does not exist. Make sure the path is correct and the file exists.`
          );
        n.remove();
      }),
      t || null
    );
  }
  var Xh = C(() => {
    l();
    je();
    dt();
  });
  var Kh = v((RD, Mo) => {
    l();
    eh();
    Qh();
    at();
    Xh();
    Mo.exports = function (e) {
      return {
        postcssPlugin: 'tailwindcss',
        plugins: [
          Pe.DEBUG &&
            function (t) {
              return (
                console.log(`
`),
                console.time('JIT TOTAL'),
                t
              );
            },
          function (t, i) {
            e = Jh(t, i) ?? e;
            let n = mo(e);
            if (t.type === 'document') {
              let s = t.nodes.filter((a) => a.type === 'root');
              for (let a of s) a.type === 'root' && Fn(n)(a, i);
              return;
            }
            Fn(n)(t, i);
          },
          !1,
          Pe.DEBUG &&
            function (t) {
              return (
                console.timeEnd('JIT TOTAL'),
                console.log(`
`),
                t
              );
            },
        ].filter(Boolean),
      };
    };
    Mo.exports.postcss = !0;
  });
  var em = v((MD, Zh) => {
    l();
    Zh.exports = Kh();
  });
  var Fo = v((FD, tm) => {
    l();
    tm.exports = () => [
      'and_chr 92',
      'and_uc 12.12',
      'chrome 92',
      'chrome 91',
      'edge 91',
      'firefox 89',
      'ios_saf 14.5-14.7',
      'ios_saf 14.0-14.4',
      'safari 14.1',
      'samsung 14.0',
    ];
  });
  var Nn = {};
  Ce(Nn, { agents: () => y_, feature: () => b_ });
  function b_() {
    return {
      status: 'cr',
      title: 'CSS Feature Queries',
      stats: {
        ie: { 6: 'n', 7: 'n', 8: 'n', 9: 'n', 10: 'n', 11: 'n', 5.5: 'n' },
        edge: {
          12: 'y',
          13: 'y',
          14: 'y',
          15: 'y',
          16: 'y',
          17: 'y',
          18: 'y',
          79: 'y',
          80: 'y',
          81: 'y',
          83: 'y',
          84: 'y',
          85: 'y',
          86: 'y',
          87: 'y',
          88: 'y',
          89: 'y',
          90: 'y',
          91: 'y',
          92: 'y',
        },
        firefox: {
          2: 'n',
          3: 'n',
          4: 'n',
          5: 'n',
          6: 'n',
          7: 'n',
          8: 'n',
          9: 'n',
          10: 'n',
          11: 'n',
          12: 'n',
          13: 'n',
          14: 'n',
          15: 'n',
          16: 'n',
          17: 'n',
          18: 'n',
          19: 'n',
          20: 'n',
          21: 'n',
          22: 'y',
          23: 'y',
          24: 'y',
          25: 'y',
          26: 'y',
          27: 'y',
          28: 'y',
          29: 'y',
          30: 'y',
          31: 'y',
          32: 'y',
          33: 'y',
          34: 'y',
          35: 'y',
          36: 'y',
          37: 'y',
          38: 'y',
          39: 'y',
          40: 'y',
          41: 'y',
          42: 'y',
          43: 'y',
          44: 'y',
          45: 'y',
          46: 'y',
          47: 'y',
          48: 'y',
          49: 'y',
          50: 'y',
          51: 'y',
          52: 'y',
          53: 'y',
          54: 'y',
          55: 'y',
          56: 'y',
          57: 'y',
          58: 'y',
          59: 'y',
          60: 'y',
          61: 'y',
          62: 'y',
          63: 'y',
          64: 'y',
          65: 'y',
          66: 'y',
          67: 'y',
          68: 'y',
          69: 'y',
          70: 'y',
          71: 'y',
          72: 'y',
          73: 'y',
          74: 'y',
          75: 'y',
          76: 'y',
          77: 'y',
          78: 'y',
          79: 'y',
          80: 'y',
          81: 'y',
          82: 'y',
          83: 'y',
          84: 'y',
          85: 'y',
          86: 'y',
          87: 'y',
          88: 'y',
          89: 'y',
          90: 'y',
          91: 'y',
          92: 'y',
          93: 'y',
          3.5: 'n',
          3.6: 'n',
        },
        chrome: {
          4: 'n',
          5: 'n',
          6: 'n',
          7: 'n',
          8: 'n',
          9: 'n',
          10: 'n',
          11: 'n',
          12: 'n',
          13: 'n',
          14: 'n',
          15: 'n',
          16: 'n',
          17: 'n',
          18: 'n',
          19: 'n',
          20: 'n',
          21: 'n',
          22: 'n',
          23: 'n',
          24: 'n',
          25: 'n',
          26: 'n',
          27: 'n',
          28: 'y',
          29: 'y',
          30: 'y',
          31: 'y',
          32: 'y',
          33: 'y',
          34: 'y',
          35: 'y',
          36: 'y',
          37: 'y',
          38: 'y',
          39: 'y',
          40: 'y',
          41: 'y',
          42: 'y',
          43: 'y',
          44: 'y',
          45: 'y',
          46: 'y',
          47: 'y',
          48: 'y',
          49: 'y',
          50: 'y',
          51: 'y',
          52: 'y',
          53: 'y',
          54: 'y',
          55: 'y',
          56: 'y',
          57: 'y',
          58: 'y',
          59: 'y',
          60: 'y',
          61: 'y',
          62: 'y',
          63: 'y',
          64: 'y',
          65: 'y',
          66: 'y',
          67: 'y',
          68: 'y',
          69: 'y',
          70: 'y',
          71: 'y',
          72: 'y',
          73: 'y',
          74: 'y',
          75: 'y',
          76: 'y',
          77: 'y',
          78: 'y',
          79: 'y',
          80: 'y',
          81: 'y',
          83: 'y',
          84: 'y',
          85: 'y',
          86: 'y',
          87: 'y',
          88: 'y',
          89: 'y',
          90: 'y',
          91: 'y',
          92: 'y',
          93: 'y',
          94: 'y',
          95: 'y',
        },
        safari: {
          4: 'n',
          5: 'n',
          6: 'n',
          7: 'n',
          8: 'n',
          9: 'y',
          10: 'y',
          11: 'y',
          12: 'y',
          13: 'y',
          14: 'y',
          15: 'y',
          9.1: 'y',
          10.1: 'y',
          11.1: 'y',
          12.1: 'y',
          13.1: 'y',
          14.1: 'y',
          TP: 'y',
          3.1: 'n',
          3.2: 'n',
          5.1: 'n',
          6.1: 'n',
          7.1: 'n',
        },
        opera: {
          9: 'n',
          11: 'n',
          12: 'n',
          15: 'y',
          16: 'y',
          17: 'y',
          18: 'y',
          19: 'y',
          20: 'y',
          21: 'y',
          22: 'y',
          23: 'y',
          24: 'y',
          25: 'y',
          26: 'y',
          27: 'y',
          28: 'y',
          29: 'y',
          30: 'y',
          31: 'y',
          32: 'y',
          33: 'y',
          34: 'y',
          35: 'y',
          36: 'y',
          37: 'y',
          38: 'y',
          39: 'y',
          40: 'y',
          41: 'y',
          42: 'y',
          43: 'y',
          44: 'y',
          45: 'y',
          46: 'y',
          47: 'y',
          48: 'y',
          49: 'y',
          50: 'y',
          51: 'y',
          52: 'y',
          53: 'y',
          54: 'y',
          55: 'y',
          56: 'y',
          57: 'y',
          58: 'y',
          60: 'y',
          62: 'y',
          63: 'y',
          64: 'y',
          65: 'y',
          66: 'y',
          67: 'y',
          68: 'y',
          69: 'y',
          70: 'y',
          71: 'y',
          72: 'y',
          73: 'y',
          74: 'y',
          75: 'y',
          76: 'y',
          77: 'y',
          78: 'y',
          12.1: 'y',
          '9.5-9.6': 'n',
          '10.0-10.1': 'n',
          10.5: 'n',
          10.6: 'n',
          11.1: 'n',
          11.5: 'n',
          11.6: 'n',
        },
        ios_saf: {
          8: 'n',
          '9.0-9.2': 'y',
          9.3: 'y',
          '10.0-10.2': 'y',
          10.3: 'y',
          '11.0-11.2': 'y',
          '11.3-11.4': 'y',
          '12.0-12.1': 'y',
          '12.2-12.4': 'y',
          '13.0-13.1': 'y',
          13.2: 'y',
          13.3: 'y',
          '13.4-13.7': 'y',
          '14.0-14.4': 'y',
          '14.5-14.7': 'y',
          3.2: 'n',
          '4.0-4.1': 'n',
          '4.2-4.3': 'n',
          '5.0-5.1': 'n',
          '6.0-6.1': 'n',
          '7.0-7.1': 'n',
          '8.1-8.4': 'n',
        },
        op_mini: { all: 'y' },
        android: {
          3: 'n',
          4: 'n',
          92: 'y',
          4.4: 'y',
          '4.4.3-4.4.4': 'y',
          2.1: 'n',
          2.2: 'n',
          2.3: 'n',
          4.1: 'n',
          '4.2-4.3': 'n',
        },
        bb: { 7: 'n', 10: 'n' },
        op_mob: {
          10: 'n',
          11: 'n',
          12: 'n',
          64: 'y',
          11.1: 'n',
          11.5: 'n',
          12.1: 'n',
        },
        and_chr: { 92: 'y' },
        and_ff: { 90: 'y' },
        ie_mob: { 10: 'n', 11: 'n' },
        and_uc: { 12.12: 'y' },
        samsung: {
          4: 'y',
          '5.0-5.4': 'y',
          '6.2-6.4': 'y',
          '7.2-7.4': 'y',
          8.2: 'y',
          9.2: 'y',
          10.1: 'y',
          '11.1-11.2': 'y',
          '12.0': 'y',
          '13.0': 'y',
          '14.0': 'y',
        },
        and_qq: { 10.4: 'y' },
        baidu: { 7.12: 'y' },
        kaios: { 2.5: 'y' },
      },
    };
  }
  var y_,
    Ln = C(() => {
      l();
      y_ = {
        ie: { prefix: 'ms' },
        edge: {
          prefix: 'webkit',
          prefix_exceptions: {
            12: 'ms',
            13: 'ms',
            14: 'ms',
            15: 'ms',
            16: 'ms',
            17: 'ms',
            18: 'ms',
          },
        },
        firefox: { prefix: 'moz' },
        chrome: { prefix: 'webkit' },
        safari: { prefix: 'webkit' },
        opera: {
          prefix: 'webkit',
          prefix_exceptions: {
            9: 'o',
            11: 'o',
            12: 'o',
            '9.5-9.6': 'o',
            '10.0-10.1': 'o',
            10.5: 'o',
            10.6: 'o',
            11.1: 'o',
            11.5: 'o',
            11.6: 'o',
            12.1: 'o',
          },
        },
        ios_saf: { prefix: 'webkit' },
        op_mini: { prefix: 'o' },
        android: { prefix: 'webkit' },
        bb: { prefix: 'webkit' },
        op_mob: { prefix: 'o', prefix_exceptions: { 64: 'webkit' } },
        and_chr: { prefix: 'webkit' },
        and_ff: { prefix: 'moz' },
        ie_mob: { prefix: 'ms' },
        and_uc: { prefix: 'webkit', prefix_exceptions: { 12.12: 'webkit' } },
        samsung: { prefix: 'webkit' },
        and_qq: { prefix: 'webkit' },
        baidu: { prefix: 'webkit' },
        kaios: { prefix: 'moz' },
      };
    });
  var rm = v(() => {
    l();
  });
  var ue = v((BD, ut) => {
    l();
    var { list: No } = me();
    ut.exports.error = function (r) {
      let e = new Error(r);
      throw ((e.autoprefixer = !0), e);
    };
    ut.exports.uniq = function (r) {
      return [...new Set(r)];
    };
    ut.exports.removeNote = function (r) {
      return r.includes(' ') ? r.split(' ')[0] : r;
    };
    ut.exports.escapeRegexp = function (r) {
      return r.replace(/[$()*+-.?[\\\]^{|}]/g, '\\$&');
    };
    ut.exports.regexp = function (r, e = !0) {
      return (
        e && (r = this.escapeRegexp(r)),
        new RegExp(`(^|[\\s,(])(${r}($|[\\s(,]))`, 'gi')
      );
    };
    ut.exports.editList = function (r, e) {
      let t = No.comma(r),
        i = e(t, []);
      if (t === i) return r;
      let n = r.match(/,\s*/);
      return (n = n ? n[0] : ', '), i.join(n);
    };
    ut.exports.splitSelector = function (r) {
      return No.comma(r).map((e) =>
        No.space(e).map((t) => t.split(/(?=\.|#)/g))
      );
    };
  });
  var ft = v(($D, sm) => {
    l();
    var w_ = Fo(),
      im = (Ln(), Nn).agents,
      v_ = ue(),
      nm = class {
        static prefixes() {
          if (this.prefixesCache) return this.prefixesCache;
          this.prefixesCache = [];
          for (let e in im) this.prefixesCache.push(`-${im[e].prefix}-`);
          return (
            (this.prefixesCache = v_
              .uniq(this.prefixesCache)
              .sort((e, t) => t.length - e.length)),
            this.prefixesCache
          );
        }
        static withPrefix(e) {
          return (
            this.prefixesRegexp ||
              (this.prefixesRegexp = new RegExp(this.prefixes().join('|'))),
            this.prefixesRegexp.test(e)
          );
        }
        constructor(e, t, i, n) {
          (this.data = e),
            (this.options = i || {}),
            (this.browserslistOpts = n || {}),
            (this.selected = this.parse(t));
        }
        parse(e) {
          let t = {};
          for (let i in this.browserslistOpts) t[i] = this.browserslistOpts[i];
          return (t.path = this.options.from), w_(e, t);
        }
        prefix(e) {
          let [t, i] = e.split(' '),
            n = this.data[t],
            s = n.prefix_exceptions && n.prefix_exceptions[i];
          return s || (s = n.prefix), `-${s}-`;
        }
        isSelected(e) {
          return this.selected.includes(e);
        }
      };
    sm.exports = nm;
  });
  var ei = v((jD, am) => {
    l();
    am.exports = {
      prefix(r) {
        let e = r.match(/^(-\w+-)/);
        return e ? e[0] : '';
      },
      unprefixed(r) {
        return r.replace(/^-\w+-/, '');
      },
    };
  });
  var zt = v((zD, lm) => {
    l();
    var x_ = ft(),
      om = ei(),
      k_ = ue();
    function Lo(r, e) {
      let t = new r.constructor();
      for (let i of Object.keys(r || {})) {
        let n = r[i];
        i === 'parent' && typeof n == 'object'
          ? e && (t[i] = e)
          : i === 'source' || i === null
          ? (t[i] = n)
          : Array.isArray(n)
          ? (t[i] = n.map((s) => Lo(s, t)))
          : i !== '_autoprefixerPrefix' &&
            i !== '_autoprefixerValues' &&
            i !== 'proxyCache' &&
            (typeof n == 'object' && n !== null && (n = Lo(n, t)), (t[i] = n));
      }
      return t;
    }
    var Bn = class {
      static hack(e) {
        return (
          this.hacks || (this.hacks = {}),
          e.names.map((t) => ((this.hacks[t] = e), this.hacks[t]))
        );
      }
      static load(e, t, i) {
        let n = this.hacks && this.hacks[e];
        return n ? new n(e, t, i) : new this(e, t, i);
      }
      static clone(e, t) {
        let i = Lo(e);
        for (let n in t) i[n] = t[n];
        return i;
      }
      constructor(e, t, i) {
        (this.prefixes = t), (this.name = e), (this.all = i);
      }
      parentPrefix(e) {
        let t;
        return (
          typeof e._autoprefixerPrefix != 'undefined'
            ? (t = e._autoprefixerPrefix)
            : e.type === 'decl' && e.prop[0] === '-'
            ? (t = om.prefix(e.prop))
            : e.type === 'root'
            ? (t = !1)
            : e.type === 'rule' &&
              e.selector.includes(':-') &&
              /:(-\w+-)/.test(e.selector)
            ? (t = e.selector.match(/:(-\w+-)/)[1])
            : e.type === 'atrule' && e.name[0] === '-'
            ? (t = om.prefix(e.name))
            : (t = this.parentPrefix(e.parent)),
          x_.prefixes().includes(t) || (t = !1),
          (e._autoprefixerPrefix = t),
          e._autoprefixerPrefix
        );
      }
      process(e, t) {
        if (!this.check(e)) return;
        let i = this.parentPrefix(e),
          n = this.prefixes.filter((a) => !i || i === k_.removeNote(a)),
          s = [];
        for (let a of n) this.add(e, a, s.concat([a]), t) && s.push(a);
        return s;
      }
      clone(e, t) {
        return Bn.clone(e, t);
      }
    };
    lm.exports = Bn;
  });
  var q = v((VD, cm) => {
    l();
    var S_ = zt(),
      __ = ft(),
      um = ue(),
      fm = class extends S_ {
        check() {
          return !0;
        }
        prefixed(e, t) {
          return t + e;
        }
        normalize(e) {
          return e;
        }
        otherPrefixes(e, t) {
          for (let i of __.prefixes()) if (i !== t && e.includes(i)) return !0;
          return !1;
        }
        set(e, t) {
          return (e.prop = this.prefixed(e.prop, t)), e;
        }
        needCascade(e) {
          return (
            e._autoprefixerCascade ||
              (e._autoprefixerCascade =
                this.all.options.cascade !== !1 &&
                e.raw('before').includes(`
`)),
            e._autoprefixerCascade
          );
        }
        maxPrefixed(e, t) {
          if (t._autoprefixerMax) return t._autoprefixerMax;
          let i = 0;
          for (let n of e)
            (n = um.removeNote(n)), n.length > i && (i = n.length);
          return (t._autoprefixerMax = i), t._autoprefixerMax;
        }
        calcBefore(e, t, i = '') {
          let s = this.maxPrefixed(e, t) - um.removeNote(i).length,
            a = t.raw('before');
          return s > 0 && (a += Array(s).fill(' ').join('')), a;
        }
        restoreBefore(e) {
          let t = e.raw('before').split(`
`),
            i = t[t.length - 1];
          this.all.group(e).up((n) => {
            let s = n.raw('before').split(`
`),
              a = s[s.length - 1];
            a.length < i.length && (i = a);
          }),
            (t[t.length - 1] = i),
            (e.raws.before = t.join(`
`));
        }
        insert(e, t, i) {
          let n = this.set(this.clone(e), t);
          if (
            !(
              !n ||
              e.parent.some((a) => a.prop === n.prop && a.value === n.value)
            )
          )
            return (
              this.needCascade(e) && (n.raws.before = this.calcBefore(i, e, t)),
              e.parent.insertBefore(e, n)
            );
        }
        isAlready(e, t) {
          let i = this.all.group(e).up((n) => n.prop === t);
          return i || (i = this.all.group(e).down((n) => n.prop === t)), i;
        }
        add(e, t, i, n) {
          let s = this.prefixed(e.prop, t);
          if (!(this.isAlready(e, s) || this.otherPrefixes(e.value, t)))
            return this.insert(e, t, i, n);
        }
        process(e, t) {
          if (!this.needCascade(e)) {
            super.process(e, t);
            return;
          }
          let i = super.process(e, t);
          !i ||
            !i.length ||
            (this.restoreBefore(e), (e.raws.before = this.calcBefore(i, e)));
        }
        old(e, t) {
          return [this.prefixed(e, t)];
        }
      };
    cm.exports = fm;
  });
  var dm = v((UD, pm) => {
    l();
    pm.exports = function r(e) {
      return {
        mul: (t) => new r(e * t),
        div: (t) => new r(e / t),
        simplify: () => new r(e),
        toString: () => e.toString(),
      };
    };
  });
  var gm = v((WD, mm) => {
    l();
    var C_ = dm(),
      A_ = zt(),
      Bo = ue(),
      O_ = /(min|max)-resolution\s*:\s*\d*\.?\d+(dppx|dpcm|dpi|x)/gi,
      E_ = /(min|max)-resolution(\s*:\s*)(\d*\.?\d+)(dppx|dpcm|dpi|x)/i,
      hm = class extends A_ {
        prefixName(e, t) {
          return e === '-moz-'
            ? t + '--moz-device-pixel-ratio'
            : e + t + '-device-pixel-ratio';
        }
        prefixQuery(e, t, i, n, s) {
          return (
            (n = new C_(n)),
            s === 'dpi'
              ? (n = n.div(96))
              : s === 'dpcm' && (n = n.mul(2.54).div(96)),
            (n = n.simplify()),
            e === '-o-' && (n = n.n + '/' + n.d),
            this.prefixName(e, t) + i + n
          );
        }
        clean(e) {
          if (!this.bad) {
            this.bad = [];
            for (let t of this.prefixes)
              this.bad.push(this.prefixName(t, 'min')),
                this.bad.push(this.prefixName(t, 'max'));
          }
          e.params = Bo.editList(e.params, (t) =>
            t.filter((i) => this.bad.every((n) => !i.includes(n)))
          );
        }
        process(e) {
          let t = this.parentPrefix(e),
            i = t ? [t] : this.prefixes;
          e.params = Bo.editList(e.params, (n, s) => {
            for (let a of n) {
              if (
                !a.includes('min-resolution') &&
                !a.includes('max-resolution')
              ) {
                s.push(a);
                continue;
              }
              for (let o of i) {
                let u = a.replace(O_, (c) => {
                  let f = c.match(E_);
                  return this.prefixQuery(o, f[1], f[2], f[3], f[4]);
                });
                s.push(u);
              }
              s.push(a);
            }
            return Bo.uniq(s);
          });
        }
      };
    mm.exports = hm;
  });
  var xm = v((GD, vm) => {
    l();
    var { list: T_ } = me(),
      ym = Kr(),
      P_ = ft(),
      bm = ei(),
      wm = class {
        constructor(e) {
          (this.props = ['transition', 'transition-property']),
            (this.prefixes = e);
        }
        add(e, t) {
          let i,
            n,
            s = this.prefixes.add[e.prop],
            a = this.ruleVendorPrefixes(e),
            o = a || (s && s.prefixes) || [],
            u = this.parse(e.value),
            c = u.map((h) => this.findProp(h)),
            f = [];
          if (c.some((h) => h[0] === '-')) return;
          for (let h of u) {
            if (((n = this.findProp(h)), n[0] === '-')) continue;
            let y = this.prefixes.add[n];
            if (!(!y || !y.prefixes))
              for (i of y.prefixes) {
                if (a && !a.some((b) => i.includes(b))) continue;
                let x = this.prefixes.prefixed(n, i);
                x !== '-ms-transform' &&
                  !c.includes(x) &&
                  (this.disabled(n, i) || f.push(this.clone(n, x, h)));
              }
          }
          u = u.concat(f);
          let p = this.stringify(u),
            d = this.stringify(this.cleanFromUnprefixed(u, '-webkit-'));
          if (
            (o.includes('-webkit-') &&
              this.cloneBefore(e, `-webkit-${e.prop}`, d),
            this.cloneBefore(e, e.prop, d),
            o.includes('-o-'))
          ) {
            let h = this.stringify(this.cleanFromUnprefixed(u, '-o-'));
            this.cloneBefore(e, `-o-${e.prop}`, h);
          }
          for (i of o)
            if (i !== '-webkit-' && i !== '-o-') {
              let h = this.stringify(this.cleanOtherPrefixes(u, i));
              this.cloneBefore(e, i + e.prop, h);
            }
          p !== e.value &&
            !this.already(e, e.prop, p) &&
            (this.checkForWarning(t, e), e.cloneBefore(), (e.value = p));
        }
        findProp(e) {
          let t = e[0].value;
          if (/^\d/.test(t)) {
            for (let [i, n] of e.entries())
              if (i !== 0 && n.type === 'word') return n.value;
          }
          return t;
        }
        already(e, t, i) {
          return e.parent.some((n) => n.prop === t && n.value === i);
        }
        cloneBefore(e, t, i) {
          this.already(e, t, i) || e.cloneBefore({ prop: t, value: i });
        }
        checkForWarning(e, t) {
          if (t.prop !== 'transition-property') return;
          let i = !1,
            n = !1;
          t.parent.each((s) => {
            if (s.type !== 'decl' || s.prop.indexOf('transition-') !== 0)
              return;
            let a = T_.comma(s.value);
            if (s.prop === 'transition-property') {
              a.forEach((o) => {
                let u = this.prefixes.add[o];
                u && u.prefixes && u.prefixes.length > 0 && (i = !0);
              });
              return;
            }
            return (n = n || a.length > 1), !1;
          }),
            i &&
              n &&
              t.warn(
                e,
                'Replace transition-property to transition, because Autoprefixer could not support any cases of transition-property and other transition-*'
              );
        }
        remove(e) {
          let t = this.parse(e.value);
          t = t.filter((a) => {
            let o = this.prefixes.remove[this.findProp(a)];
            return !o || !o.remove;
          });
          let i = this.stringify(t);
          if (e.value === i) return;
          if (t.length === 0) {
            e.remove();
            return;
          }
          let n = e.parent.some((a) => a.prop === e.prop && a.value === i),
            s = e.parent.some(
              (a) => a !== e && a.prop === e.prop && a.value.length > i.length
            );
          if (n || s) {
            e.remove();
            return;
          }
          e.value = i;
        }
        parse(e) {
          let t = ym(e),
            i = [],
            n = [];
          for (let s of t.nodes)
            n.push(s),
              s.type === 'div' && s.value === ',' && (i.push(n), (n = []));
          return i.push(n), i.filter((s) => s.length > 0);
        }
        stringify(e) {
          if (e.length === 0) return '';
          let t = [];
          for (let i of e)
            i[i.length - 1].type !== 'div' && i.push(this.div(e)),
              (t = t.concat(i));
          return (
            t[0].type === 'div' && (t = t.slice(1)),
            t[t.length - 1].type === 'div' &&
              (t = t.slice(0, -2 + 1 || void 0)),
            ym.stringify({ nodes: t })
          );
        }
        clone(e, t, i) {
          let n = [],
            s = !1;
          for (let a of i)
            !s && a.type === 'word' && a.value === e
              ? (n.push({ type: 'word', value: t }), (s = !0))
              : n.push(a);
          return n;
        }
        div(e) {
          for (let t of e)
            for (let i of t) if (i.type === 'div' && i.value === ',') return i;
          return { type: 'div', value: ',', after: ' ' };
        }
        cleanOtherPrefixes(e, t) {
          return e.filter((i) => {
            let n = bm.prefix(this.findProp(i));
            return n === '' || n === t;
          });
        }
        cleanFromUnprefixed(e, t) {
          let i = e
              .map((s) => this.findProp(s))
              .filter((s) => s.slice(0, t.length) === t)
              .map((s) => this.prefixes.unprefixed(s)),
            n = [];
          for (let s of e) {
            let a = this.findProp(s),
              o = bm.prefix(a);
            !i.includes(a) && (o === t || o === '') && n.push(s);
          }
          return n;
        }
        disabled(e, t) {
          let i = ['order', 'justify-content', 'align-self', 'align-content'];
          if (e.includes('flex') || i.includes(e)) {
            if (this.prefixes.options.flexbox === !1) return !0;
            if (this.prefixes.options.flexbox === 'no-2009')
              return t.includes('2009');
          }
        }
        ruleVendorPrefixes(e) {
          let { parent: t } = e;
          if (t.type !== 'rule') return !1;
          if (!t.selector.includes(':-')) return !1;
          let i = P_.prefixes().filter((n) => t.selector.includes(':' + n));
          return i.length > 0 ? i : !1;
        }
      };
    vm.exports = wm;
  });
  var Vt = v((HD, Sm) => {
    l();
    var D_ = ue(),
      km = class {
        constructor(e, t, i, n) {
          (this.unprefixed = e),
            (this.prefixed = t),
            (this.string = i || t),
            (this.regexp = n || D_.regexp(t));
        }
        check(e) {
          return e.includes(this.string) ? !!e.match(this.regexp) : !1;
        }
      };
    Sm.exports = km;
  });
  var ke = v((YD, Cm) => {
    l();
    var I_ = zt(),
      q_ = Vt(),
      R_ = ei(),
      M_ = ue(),
      _m = class extends I_ {
        static save(e, t) {
          let i = t.prop,
            n = [];
          for (let s in t._autoprefixerValues) {
            let a = t._autoprefixerValues[s];
            if (a === t.value) continue;
            let o,
              u = R_.prefix(i);
            if (u === '-pie-') continue;
            if (u === s) {
              (o = t.value = a), n.push(o);
              continue;
            }
            let c = e.prefixed(i, s),
              f = t.parent;
            if (!f.every((y) => y.prop !== c)) {
              n.push(o);
              continue;
            }
            let p = a.replace(/\s+/, ' ');
            if (
              f.some(
                (y) => y.prop === t.prop && y.value.replace(/\s+/, ' ') === p
              )
            ) {
              n.push(o);
              continue;
            }
            let h = this.clone(t, { value: a });
            (o = t.parent.insertBefore(t, h)), n.push(o);
          }
          return n;
        }
        check(e) {
          let t = e.value;
          return t.includes(this.name) ? !!t.match(this.regexp()) : !1;
        }
        regexp() {
          return this.regexpCache || (this.regexpCache = M_.regexp(this.name));
        }
        replace(e, t) {
          return e.replace(this.regexp(), `$1${t}$2`);
        }
        value(e) {
          return e.raws.value && e.raws.value.value === e.value
            ? e.raws.value.raw
            : e.value;
        }
        add(e, t) {
          e._autoprefixerValues || (e._autoprefixerValues = {});
          let i = e._autoprefixerValues[t] || this.value(e),
            n;
          do if (((n = i), (i = this.replace(i, t)), i === !1)) return;
          while (i !== n);
          e._autoprefixerValues[t] = i;
        }
        old(e) {
          return new q_(this.name, e + this.name);
        }
      };
    Cm.exports = _m;
  });
  var ct = v((QD, Am) => {
    l();
    Am.exports = {};
  });
  var jo = v((JD, Tm) => {
    l();
    var Om = Kr(),
      F_ = ke(),
      N_ = ct().insertAreas,
      L_ = /(^|[^-])linear-gradient\(\s*(top|left|right|bottom)/i,
      B_ = /(^|[^-])radial-gradient\(\s*\d+(\w*|%)\s+\d+(\w*|%)\s*,/i,
      $_ = /(!\s*)?autoprefixer:\s*ignore\s+next/i,
      j_ = /(!\s*)?autoprefixer\s*grid:\s*(on|off|(no-)?autoplace)/i,
      z_ = [
        'width',
        'height',
        'min-width',
        'max-width',
        'min-height',
        'max-height',
        'inline-size',
        'min-inline-size',
        'max-inline-size',
        'block-size',
        'min-block-size',
        'max-block-size',
      ];
    function $o(r) {
      return r.parent.some(
        (e) => e.prop === 'grid-template' || e.prop === 'grid-template-areas'
      );
    }
    function V_(r) {
      let e = r.parent.some((i) => i.prop === 'grid-template-rows'),
        t = r.parent.some((i) => i.prop === 'grid-template-columns');
      return e && t;
    }
    var Em = class {
      constructor(e) {
        this.prefixes = e;
      }
      add(e, t) {
        let i = this.prefixes.add['@resolution'],
          n = this.prefixes.add['@keyframes'],
          s = this.prefixes.add['@viewport'],
          a = this.prefixes.add['@supports'];
        e.walkAtRules((f) => {
          if (f.name === 'keyframes') {
            if (!this.disabled(f, t)) return n && n.process(f);
          } else if (f.name === 'viewport') {
            if (!this.disabled(f, t)) return s && s.process(f);
          } else if (f.name === 'supports') {
            if (this.prefixes.options.supports !== !1 && !this.disabled(f, t))
              return a.process(f);
          } else if (
            f.name === 'media' &&
            f.params.includes('-resolution') &&
            !this.disabled(f, t)
          )
            return i && i.process(f);
        }),
          e.walkRules((f) => {
            if (!this.disabled(f, t))
              return this.prefixes.add.selectors.map((p) => p.process(f, t));
          });
        function o(f) {
          return f.parent.nodes.some((p) => {
            if (p.type !== 'decl') return !1;
            let d = p.prop === 'display' && /(inline-)?grid/.test(p.value),
              h = p.prop.startsWith('grid-template'),
              y = /^grid-([A-z]+-)?gap/.test(p.prop);
            return d || h || y;
          });
        }
        function u(f) {
          return f.parent.some(
            (p) => p.prop === 'display' && /(inline-)?flex/.test(p.value)
          );
        }
        let c =
          this.gridStatus(e, t) &&
          this.prefixes.add['grid-area'] &&
          this.prefixes.add['grid-area'].prefixes;
        return (
          e.walkDecls((f) => {
            if (this.disabledDecl(f, t)) return;
            let p = f.parent,
              d = f.prop,
              h = f.value;
            if (d === 'grid-row-span') {
              t.warn(
                'grid-row-span is not part of final Grid Layout. Use grid-row.',
                { node: f }
              );
              return;
            } else if (d === 'grid-column-span') {
              t.warn(
                'grid-column-span is not part of final Grid Layout. Use grid-column.',
                { node: f }
              );
              return;
            } else if (d === 'display' && h === 'box') {
              t.warn(
                'You should write display: flex by final spec instead of display: box',
                { node: f }
              );
              return;
            } else if (d === 'text-emphasis-position')
              (h === 'under' || h === 'over') &&
                t.warn(
                  'You should use 2 values for text-emphasis-position For example, `under left` instead of just `under`.',
                  { node: f }
                );
            else if (/^(align|justify|place)-(items|content)$/.test(d) && u(f))
              (h === 'start' || h === 'end') &&
                t.warn(
                  `${h} value has mixed support, consider using flex-${h} instead`,
                  { node: f }
                );
            else if (d === 'text-decoration-skip' && h === 'ink')
              t.warn(
                'Replace text-decoration-skip: ink to text-decoration-skip-ink: auto, because spec had been changed',
                { node: f }
              );
            else {
              if (c && this.gridStatus(f, t))
                if (
                  (f.value === 'subgrid' &&
                    t.warn('IE does not support subgrid', { node: f }),
                  /^(align|justify|place)-items$/.test(d) && o(f))
                ) {
                  let x = d.replace('-items', '-self');
                  t.warn(
                    `IE does not support ${d} on grid containers. Try using ${x} on child elements instead: ${f.parent.selector} > * { ${x}: ${f.value} }`,
                    { node: f }
                  );
                } else if (/^(align|justify|place)-content$/.test(d) && o(f))
                  t.warn(`IE does not support ${f.prop} on grid containers`, {
                    node: f,
                  });
                else if (d === 'display' && f.value === 'contents') {
                  t.warn(
                    'Please do not use display: contents; if you have grid setting enabled',
                    { node: f }
                  );
                  return;
                } else if (f.prop === 'grid-gap') {
                  let x = this.gridStatus(f, t);
                  x === 'autoplace' && !V_(f) && !$o(f)
                    ? t.warn(
                        'grid-gap only works if grid-template(-areas) is being used or both rows and columns have been declared and cells have not been manually placed inside the explicit grid',
                        { node: f }
                      )
                    : (x === !0 || x === 'no-autoplace') &&
                      !$o(f) &&
                      t.warn(
                        'grid-gap only works if grid-template(-areas) is being used',
                        { node: f }
                      );
                } else if (d === 'grid-auto-columns') {
                  t.warn('grid-auto-columns is not supported by IE', {
                    node: f,
                  });
                  return;
                } else if (d === 'grid-auto-rows') {
                  t.warn('grid-auto-rows is not supported by IE', { node: f });
                  return;
                } else if (d === 'grid-auto-flow') {
                  let x = p.some((w) => w.prop === 'grid-template-rows'),
                    b = p.some((w) => w.prop === 'grid-template-columns');
                  $o(f)
                    ? t.warn('grid-auto-flow is not supported by IE', {
                        node: f,
                      })
                    : h.includes('dense')
                    ? t.warn('grid-auto-flow: dense is not supported by IE', {
                        node: f,
                      })
                    : !x &&
                      !b &&
                      t.warn(
                        'grid-auto-flow works only if grid-template-rows and grid-template-columns are present in the same rule',
                        { node: f }
                      );
                  return;
                } else if (h.includes('auto-fit')) {
                  t.warn('auto-fit value is not supported by IE', {
                    node: f,
                    word: 'auto-fit',
                  });
                  return;
                } else if (h.includes('auto-fill')) {
                  t.warn('auto-fill value is not supported by IE', {
                    node: f,
                    word: 'auto-fill',
                  });
                  return;
                } else
                  d.startsWith('grid-template') &&
                    h.includes('[') &&
                    t.warn(
                      'Autoprefixer currently does not support line names. Try using grid-template-areas instead.',
                      { node: f, word: '[' }
                    );
              if (h.includes('radial-gradient'))
                if (B_.test(f.value))
                  t.warn(
                    'Gradient has outdated direction syntax. New syntax is like `closest-side at 0 0` instead of `0 0, closest-side`.',
                    { node: f }
                  );
                else {
                  let x = Om(h);
                  for (let b of x.nodes)
                    if (b.type === 'function' && b.value === 'radial-gradient')
                      for (let w of b.nodes)
                        w.type === 'word' &&
                          (w.value === 'cover'
                            ? t.warn(
                                'Gradient has outdated direction syntax. Replace `cover` to `farthest-corner`.',
                                { node: f }
                              )
                            : w.value === 'contain' &&
                              t.warn(
                                'Gradient has outdated direction syntax. Replace `contain` to `closest-side`.',
                                { node: f }
                              ));
                }
              h.includes('linear-gradient') &&
                L_.test(h) &&
                t.warn(
                  'Gradient has outdated direction syntax. New syntax is like `to left` instead of `right`.',
                  { node: f }
                );
            }
            z_.includes(f.prop) &&
              (f.value.includes('-fill-available') ||
                (f.value.includes('fill-available')
                  ? t.warn(
                      'Replace fill-available to stretch, because spec had been changed',
                      { node: f }
                    )
                  : f.value.includes('fill') &&
                    Om(h).nodes.some(
                      (b) => b.type === 'word' && b.value === 'fill'
                    ) &&
                    t.warn(
                      'Replace fill to stretch, because spec had been changed',
                      { node: f }
                    )));
            let y;
            if (f.prop === 'transition' || f.prop === 'transition-property')
              return this.prefixes.transition.add(f, t);
            if (f.prop === 'align-self') {
              if (
                (this.displayType(f) !== 'grid' &&
                  this.prefixes.options.flexbox !== !1 &&
                  ((y = this.prefixes.add['align-self']),
                  y && y.prefixes && y.process(f)),
                this.gridStatus(f, t) !== !1 &&
                  ((y = this.prefixes.add['grid-row-align']), y && y.prefixes))
              )
                return y.process(f, t);
            } else if (f.prop === 'justify-self') {
              if (
                this.gridStatus(f, t) !== !1 &&
                ((y = this.prefixes.add['grid-column-align']), y && y.prefixes)
              )
                return y.process(f, t);
            } else if (f.prop === 'place-self') {
              if (
                ((y = this.prefixes.add['place-self']),
                y && y.prefixes && this.gridStatus(f, t) !== !1)
              )
                return y.process(f, t);
            } else if (((y = this.prefixes.add[f.prop]), y && y.prefixes))
              return y.process(f, t);
          }),
          this.gridStatus(e, t) && N_(e, this.disabled),
          e.walkDecls((f) => {
            if (this.disabledValue(f, t)) return;
            let p = this.prefixes.unprefixed(f.prop),
              d = this.prefixes.values('add', p);
            if (Array.isArray(d)) for (let h of d) h.process && h.process(f, t);
            F_.save(this.prefixes, f);
          })
        );
      }
      remove(e, t) {
        let i = this.prefixes.remove['@resolution'];
        e.walkAtRules((n, s) => {
          this.prefixes.remove[`@${n.name}`]
            ? this.disabled(n, t) || n.parent.removeChild(s)
            : n.name === 'media' &&
              n.params.includes('-resolution') &&
              i &&
              i.clean(n);
        });
        for (let n of this.prefixes.remove.selectors)
          e.walkRules((s, a) => {
            n.check(s) && (this.disabled(s, t) || s.parent.removeChild(a));
          });
        return e.walkDecls((n, s) => {
          if (this.disabled(n, t)) return;
          let a = n.parent,
            o = this.prefixes.unprefixed(n.prop);
          if (
            ((n.prop === 'transition' || n.prop === 'transition-property') &&
              this.prefixes.transition.remove(n),
            this.prefixes.remove[n.prop] && this.prefixes.remove[n.prop].remove)
          ) {
            let u = this.prefixes
              .group(n)
              .down((c) => this.prefixes.normalize(c.prop) === o);
            if (
              (o === 'flex-flow' && (u = !0), n.prop === '-webkit-box-orient')
            ) {
              let c = { 'flex-direction': !0, 'flex-flow': !0 };
              if (!n.parent.some((f) => c[f.prop])) return;
            }
            if (u && !this.withHackValue(n)) {
              n.raw('before').includes(`
`) && this.reduceSpaces(n),
                a.removeChild(s);
              return;
            }
          }
          for (let u of this.prefixes.values('remove', o)) {
            if (!u.check || !u.check(n.value)) continue;
            if (
              ((o = u.unprefixed),
              this.prefixes.group(n).down((f) => f.value.includes(o)))
            ) {
              a.removeChild(s);
              return;
            }
          }
        });
      }
      withHackValue(e) {
        return e.prop === '-webkit-background-clip' && e.value === 'text';
      }
      disabledValue(e, t) {
        return (this.gridStatus(e, t) === !1 &&
          e.type === 'decl' &&
          e.prop === 'display' &&
          e.value.includes('grid')) ||
          (this.prefixes.options.flexbox === !1 &&
            e.type === 'decl' &&
            e.prop === 'display' &&
            e.value.includes('flex')) ||
          (e.type === 'decl' && e.prop === 'content')
          ? !0
          : this.disabled(e, t);
      }
      disabledDecl(e, t) {
        if (
          this.gridStatus(e, t) === !1 &&
          e.type === 'decl' &&
          (e.prop.includes('grid') || e.prop === 'justify-items')
        )
          return !0;
        if (this.prefixes.options.flexbox === !1 && e.type === 'decl') {
          let i = ['order', 'justify-content', 'align-items', 'align-content'];
          if (e.prop.includes('flex') || i.includes(e.prop)) return !0;
        }
        return this.disabled(e, t);
      }
      disabled(e, t) {
        if (!e) return !1;
        if (e._autoprefixerDisabled !== void 0) return e._autoprefixerDisabled;
        if (e.parent) {
          let n = e.prev();
          if (n && n.type === 'comment' && $_.test(n.text))
            return (
              (e._autoprefixerDisabled = !0),
              (e._autoprefixerSelfDisabled = !0),
              !0
            );
        }
        let i = null;
        if (e.nodes) {
          let n;
          e.each((s) => {
            s.type === 'comment' &&
              /(!\s*)?autoprefixer:\s*(off|on)/i.test(s.text) &&
              (typeof n != 'undefined'
                ? t.warn(
                    'Second Autoprefixer control comment was ignored. Autoprefixer applies control comment to whole block, not to next rules.',
                    { node: s }
                  )
                : (n = /on/i.test(s.text)));
          }),
            n !== void 0 && (i = !n);
        }
        if (!e.nodes || i === null)
          if (e.parent) {
            let n = this.disabled(e.parent, t);
            e.parent._autoprefixerSelfDisabled === !0 ? (i = !1) : (i = n);
          } else i = !1;
        return (e._autoprefixerDisabled = i), i;
      }
      reduceSpaces(e) {
        let t = !1;
        if ((this.prefixes.group(e).up(() => ((t = !0), !0)), t)) return;
        let i = e.raw('before').split(`
`),
          n = i[i.length - 1].length,
          s = !1;
        this.prefixes.group(e).down((a) => {
          i = a.raw('before').split(`
`);
          let o = i.length - 1;
          i[o].length > n &&
            (s === !1 && (s = i[o].length - n),
            (i[o] = i[o].slice(0, -s)),
            (a.raws.before = i.join(`
`)));
        });
      }
      displayType(e) {
        for (let t of e.parent.nodes)
          if (t.prop === 'display') {
            if (t.value.includes('flex')) return 'flex';
            if (t.value.includes('grid')) return 'grid';
          }
        return !1;
      }
      gridStatus(e, t) {
        if (!e) return !1;
        if (e._autoprefixerGridStatus !== void 0)
          return e._autoprefixerGridStatus;
        let i = null;
        if (e.nodes) {
          let n;
          e.each((s) => {
            if (s.type === 'comment' && j_.test(s.text)) {
              let a = /:\s*autoplace/i.test(s.text),
                o = /no-autoplace/i.test(s.text);
              typeof n != 'undefined'
                ? t.warn(
                    'Second Autoprefixer grid control comment was ignored. Autoprefixer applies control comments to the whole block, not to the next rules.',
                    { node: s }
                  )
                : a
                ? (n = 'autoplace')
                : o
                ? (n = !0)
                : (n = /on/i.test(s.text));
            }
          }),
            n !== void 0 && (i = n);
        }
        if (e.type === 'atrule' && e.name === 'supports') {
          let n = e.params;
          n.includes('grid') && n.includes('auto') && (i = !1);
        }
        if (!e.nodes || i === null)
          if (e.parent) {
            let n = this.gridStatus(e.parent, t);
            e.parent._autoprefixerSelfDisabled === !0 ? (i = !1) : (i = n);
          } else
            typeof this.prefixes.options.grid != 'undefined'
              ? (i = this.prefixes.options.grid)
              : typeof m.env.AUTOPREFIXER_GRID != 'undefined'
              ? m.env.AUTOPREFIXER_GRID === 'autoplace'
                ? (i = 'autoplace')
                : (i = !0)
              : (i = !1);
        return (e._autoprefixerGridStatus = i), i;
      }
    };
    Tm.exports = Em;
  });
  var Dm = v((XD, Pm) => {
    l();
    Pm.exports = {
      A: {
        A: { 2: 'J D E F A B iB' },
        B: { 1: 'C K L G M N O R S T U V W X Y Z a P b H' },
        C: {
          1: '0 1 2 3 4 5 6 7 8 9 g h i j k l m n o p q r s t u v w x y z AB BB CB DB EB FB GB bB HB cB IB JB Q KB LB MB NB OB PB QB RB SB TB UB VB WB XB R S T kB U V W X Y Z a P b H dB',
          2: 'jB aB I c J D E F A B C K L G M N O d e f lB mB',
        },
        D: {
          1: '0 1 2 3 4 5 6 7 8 9 m n o p q r s t u v w x y z AB BB CB DB EB FB GB bB HB cB IB JB Q KB LB MB NB OB PB QB RB SB TB UB VB WB XB R S T U V W X Y Z a P b H dB nB oB',
          2: 'I c J D E F A B C K L G M N O d e f g h i j k l',
        },
        E: {
          1: 'F A B C K L G tB fB YB ZB uB vB wB',
          2: 'I c J D E pB eB qB rB sB',
        },
        F: {
          1: '0 1 2 3 4 5 6 7 8 9 G M N O d e f g h i j k l m n o p q r s t u v w x y z AB BB CB DB EB FB GB HB IB JB Q KB LB MB NB OB PB QB RB SB TB UB VB WB XB ZB',
          2: 'F B C xB yB zB 0B YB gB 1B',
        },
        G: {
          1: '7B 8B 9B AC BC CC DC EC FC GC HC IC JC KC',
          2: 'E eB 2B hB 3B 4B 5B 6B',
        },
        H: { 1: 'LC' },
        I: { 1: 'H QC RC', 2: 'aB I MC NC OC PC hB' },
        J: { 2: 'D A' },
        K: { 1: 'Q', 2: 'A B C YB gB ZB' },
        L: { 1: 'H' },
        M: { 1: 'P' },
        N: { 2: 'A B' },
        O: { 1: 'SC' },
        P: { 1: 'I TC UC VC WC XC fB YC ZC aC bC' },
        Q: { 1: 'cC' },
        R: { 1: 'dC' },
        S: { 1: 'eC' },
      },
      B: 4,
      C: 'CSS Feature Queries',
    };
  });
  var Mm = v((KD, Rm) => {
    l();
    function Im(r) {
      return r[r.length - 1];
    }
    var qm = {
      parse(r) {
        let e = [''],
          t = [e];
        for (let i of r) {
          if (i === '(') {
            (e = ['']), Im(t).push(e), t.push(e);
            continue;
          }
          if (i === ')') {
            t.pop(), (e = Im(t)), e.push('');
            continue;
          }
          e[e.length - 1] += i;
        }
        return t[0];
      },
      stringify(r) {
        let e = '';
        for (let t of r) {
          if (typeof t == 'object') {
            e += `(${qm.stringify(t)})`;
            continue;
          }
          e += t;
        }
        return e;
      },
    };
    Rm.exports = qm;
  });
  var $m = v((ZD, Bm) => {
    l();
    var U_ = Dm(),
      { feature: W_ } = (Ln(), Nn),
      { parse: G_ } = me(),
      H_ = ft(),
      zo = Mm(),
      Y_ = ke(),
      Q_ = ue(),
      Fm = W_(U_),
      Nm = [];
    for (let r in Fm.stats) {
      let e = Fm.stats[r];
      for (let t in e) {
        let i = e[t];
        /y/.test(i) && Nm.push(r + ' ' + t);
      }
    }
    var Lm = class {
      constructor(e, t) {
        (this.Prefixes = e), (this.all = t);
      }
      prefixer() {
        if (this.prefixerCache) return this.prefixerCache;
        let e = this.all.browsers.selected.filter((i) => Nm.includes(i)),
          t = new H_(this.all.browsers.data, e, this.all.options);
        return (
          (this.prefixerCache = new this.Prefixes(
            this.all.data,
            t,
            this.all.options
          )),
          this.prefixerCache
        );
      }
      parse(e) {
        let t = e.split(':'),
          i = t[0],
          n = t[1];
        return n || (n = ''), [i.trim(), n.trim()];
      }
      virtual(e) {
        let [t, i] = this.parse(e),
          n = G_('a{}').first;
        return n.append({ prop: t, value: i, raws: { before: '' } }), n;
      }
      prefixed(e) {
        let t = this.virtual(e);
        if (this.disabled(t.first)) return t.nodes;
        let i = { warn: () => null },
          n = this.prefixer().add[t.first.prop];
        n && n.process && n.process(t.first, i);
        for (let s of t.nodes) {
          for (let a of this.prefixer().values('add', t.first.prop))
            a.process(s);
          Y_.save(this.all, s);
        }
        return t.nodes;
      }
      isNot(e) {
        return typeof e == 'string' && /not\s*/i.test(e);
      }
      isOr(e) {
        return typeof e == 'string' && /\s*or\s*/i.test(e);
      }
      isProp(e) {
        return (
          typeof e == 'object' && e.length === 1 && typeof e[0] == 'string'
        );
      }
      isHack(e, t) {
        return !new RegExp(`(\\(|\\s)${Q_.escapeRegexp(t)}:`).test(e);
      }
      toRemove(e, t) {
        let [i, n] = this.parse(e),
          s = this.all.unprefixed(i),
          a = this.all.cleaner();
        if (a.remove[i] && a.remove[i].remove && !this.isHack(t, s)) return !0;
        for (let o of a.values('remove', s)) if (o.check(n)) return !0;
        return !1;
      }
      remove(e, t) {
        let i = 0;
        for (; i < e.length; ) {
          if (
            !this.isNot(e[i - 1]) &&
            this.isProp(e[i]) &&
            this.isOr(e[i + 1])
          ) {
            if (this.toRemove(e[i][0], t)) {
              e.splice(i, 2);
              continue;
            }
            i += 2;
            continue;
          }
          typeof e[i] == 'object' && (e[i] = this.remove(e[i], t)), (i += 1);
        }
        return e;
      }
      cleanBrackets(e) {
        return e.map((t) =>
          typeof t != 'object'
            ? t
            : t.length === 1 && typeof t[0] == 'object'
            ? this.cleanBrackets(t[0])
            : this.cleanBrackets(t)
        );
      }
      convert(e) {
        let t = [''];
        for (let i of e) t.push([`${i.prop}: ${i.value}`]), t.push(' or ');
        return (t[t.length - 1] = ''), t;
      }
      normalize(e) {
        if (typeof e != 'object') return e;
        if (((e = e.filter((t) => t !== '')), typeof e[0] == 'string')) {
          let t = e[0].trim();
          if (t.includes(':') || t === 'selector' || t === 'not selector')
            return [zo.stringify(e)];
        }
        return e.map((t) => this.normalize(t));
      }
      add(e, t) {
        return e.map((i) => {
          if (this.isProp(i)) {
            let n = this.prefixed(i[0]);
            return n.length > 1 ? this.convert(n) : i;
          }
          return typeof i == 'object' ? this.add(i, t) : i;
        });
      }
      process(e) {
        let t = zo.parse(e.params);
        (t = this.normalize(t)),
          (t = this.remove(t, e.params)),
          (t = this.add(t, e.params)),
          (t = this.cleanBrackets(t)),
          (e.params = zo.stringify(t));
      }
      disabled(e) {
        if (
          !this.all.options.grid &&
          ((e.prop === 'display' && e.value.includes('grid')) ||
            e.prop.includes('grid') ||
            e.prop === 'justify-items')
        )
          return !0;
        if (this.all.options.flexbox === !1) {
          if (e.prop === 'display' && e.value.includes('flex')) return !0;
          let t = ['order', 'justify-content', 'align-items', 'align-content'];
          if (e.prop.includes('flex') || t.includes(e.prop)) return !0;
        }
        return !1;
      }
    };
    Bm.exports = Lm;
  });
  var Vm = v((eI, zm) => {
    l();
    var jm = class {
      constructor(e, t) {
        (this.prefix = t),
          (this.prefixed = e.prefixed(this.prefix)),
          (this.regexp = e.regexp(this.prefix)),
          (this.prefixeds = e
            .possible()
            .map((i) => [e.prefixed(i), e.regexp(i)])),
          (this.unprefixed = e.name),
          (this.nameRegexp = e.regexp());
      }
      isHack(e) {
        let t = e.parent.index(e) + 1,
          i = e.parent.nodes;
        for (; t < i.length; ) {
          let n = i[t].selector;
          if (!n) return !0;
          if (n.includes(this.unprefixed) && n.match(this.nameRegexp))
            return !1;
          let s = !1;
          for (let [a, o] of this.prefixeds)
            if (n.includes(a) && n.match(o)) {
              s = !0;
              break;
            }
          if (!s) return !0;
          t += 1;
        }
        return !0;
      }
      check(e) {
        return !(
          !e.selector.includes(this.prefixed) ||
          !e.selector.match(this.regexp) ||
          this.isHack(e)
        );
      }
    };
    zm.exports = jm;
  });
  var Ut = v((tI, Wm) => {
    l();
    var { list: J_ } = me(),
      X_ = Vm(),
      K_ = zt(),
      Z_ = ft(),
      eC = ue(),
      Um = class extends K_ {
        constructor(e, t, i) {
          super(e, t, i);
          this.regexpCache = new Map();
        }
        check(e) {
          return e.selector.includes(this.name)
            ? !!e.selector.match(this.regexp())
            : !1;
        }
        prefixed(e) {
          return this.name.replace(/^(\W*)/, `$1${e}`);
        }
        regexp(e) {
          if (!this.regexpCache.has(e)) {
            let t = e ? this.prefixed(e) : this.name;
            this.regexpCache.set(
              e,
              new RegExp(`(^|[^:"'=])${eC.escapeRegexp(t)}`, 'gi')
            );
          }
          return this.regexpCache.get(e);
        }
        possible() {
          return Z_.prefixes();
        }
        prefixeds(e) {
          if (e._autoprefixerPrefixeds) {
            if (e._autoprefixerPrefixeds[this.name])
              return e._autoprefixerPrefixeds;
          } else e._autoprefixerPrefixeds = {};
          let t = {};
          if (e.selector.includes(',')) {
            let n = J_.comma(e.selector).filter((s) => s.includes(this.name));
            for (let s of this.possible())
              t[s] = n.map((a) => this.replace(a, s)).join(', ');
          } else
            for (let i of this.possible()) t[i] = this.replace(e.selector, i);
          return (
            (e._autoprefixerPrefixeds[this.name] = t), e._autoprefixerPrefixeds
          );
        }
        already(e, t, i) {
          let n = e.parent.index(e) - 1;
          for (; n >= 0; ) {
            let s = e.parent.nodes[n];
            if (s.type !== 'rule') return !1;
            let a = !1;
            for (let o in t[this.name]) {
              let u = t[this.name][o];
              if (s.selector === u) {
                if (i === o) return !0;
                a = !0;
                break;
              }
            }
            if (!a) return !1;
            n -= 1;
          }
          return !1;
        }
        replace(e, t) {
          return e.replace(this.regexp(), `$1${this.prefixed(t)}`);
        }
        add(e, t) {
          let i = this.prefixeds(e);
          if (this.already(e, i, t)) return;
          let n = this.clone(e, { selector: i[this.name][t] });
          e.parent.insertBefore(e, n);
        }
        old(e) {
          return new X_(this, e);
        }
      };
    Wm.exports = Um;
  });
  var Ym = v((rI, Hm) => {
    l();
    var tC = zt(),
      Gm = class extends tC {
        add(e, t) {
          let i = t + e.name;
          if (e.parent.some((a) => a.name === i && a.params === e.params))
            return;
          let s = this.clone(e, { name: i });
          return e.parent.insertBefore(e, s);
        }
        process(e) {
          let t = this.parentPrefix(e);
          for (let i of this.prefixes) (!t || t === i) && this.add(e, i);
        }
      };
    Hm.exports = Gm;
  });
  var Jm = v((iI, Qm) => {
    l();
    var rC = Ut(),
      Vo = class extends rC {
        prefixed(e) {
          return e === '-webkit-'
            ? ':-webkit-full-screen'
            : e === '-moz-'
            ? ':-moz-full-screen'
            : `:${e}fullscreen`;
        }
      };
    Vo.names = [':fullscreen'];
    Qm.exports = Vo;
  });
  var Km = v((nI, Xm) => {
    l();
    var iC = Ut(),
      Uo = class extends iC {
        possible() {
          return super.possible().concat(['-moz- old', '-ms- old']);
        }
        prefixed(e) {
          return e === '-webkit-'
            ? '::-webkit-input-placeholder'
            : e === '-ms-'
            ? '::-ms-input-placeholder'
            : e === '-ms- old'
            ? ':-ms-input-placeholder'
            : e === '-moz- old'
            ? ':-moz-placeholder'
            : `::${e}placeholder`;
        }
      };
    Uo.names = ['::placeholder'];
    Xm.exports = Uo;
  });
  var eg = v((sI, Zm) => {
    l();
    var nC = Ut(),
      Wo = class extends nC {
        prefixed(e) {
          return e === '-ms-'
            ? ':-ms-input-placeholder'
            : `:${e}placeholder-shown`;
        }
      };
    Wo.names = [':placeholder-shown'];
    Zm.exports = Wo;
  });
  var rg = v((aI, tg) => {
    l();
    var sC = Ut(),
      aC = ue(),
      Go = class extends sC {
        constructor(e, t, i) {
          super(e, t, i);
          this.prefixes &&
            (this.prefixes = aC.uniq(this.prefixes.map((n) => '-webkit-')));
        }
        prefixed(e) {
          return e === '-webkit-'
            ? '::-webkit-file-upload-button'
            : `::${e}file-selector-button`;
        }
      };
    Go.names = ['::file-selector-button'];
    tg.exports = Go;
  });
  var de = v((oI, ig) => {
    l();
    ig.exports = function (r) {
      let e;
      return (
        r === '-webkit- 2009' || r === '-moz-'
          ? (e = 2009)
          : r === '-ms-'
          ? (e = 2012)
          : r === '-webkit-' && (e = 'final'),
        r === '-webkit- 2009' && (r = '-webkit-'),
        [e, r]
      );
    };
  });
  var og = v((lI, ag) => {
    l();
    var ng = me().list,
      sg = de(),
      oC = q(),
      Wt = class extends oC {
        prefixed(e, t) {
          let i;
          return (
            ([i, t] = sg(t)), i === 2009 ? t + 'box-flex' : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'flex';
        }
        set(e, t) {
          let i = sg(t)[0];
          if (i === 2009)
            return (
              (e.value = ng.space(e.value)[0]),
              (e.value = Wt.oldValues[e.value] || e.value),
              super.set(e, t)
            );
          if (i === 2012) {
            let n = ng.space(e.value);
            n.length === 3 &&
              n[2] === '0' &&
              (e.value = n.slice(0, 2).concat('0px').join(' '));
          }
          return super.set(e, t);
        }
      };
    Wt.names = ['flex', 'box-flex'];
    Wt.oldValues = { auto: '1', none: '0' };
    ag.exports = Wt;
  });
  var fg = v((uI, ug) => {
    l();
    var lg = de(),
      lC = q(),
      Ho = class extends lC {
        prefixed(e, t) {
          let i;
          return (
            ([i, t] = lg(t)),
            i === 2009
              ? t + 'box-ordinal-group'
              : i === 2012
              ? t + 'flex-order'
              : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'order';
        }
        set(e, t) {
          return lg(t)[0] === 2009 && /\d/.test(e.value)
            ? ((e.value = (parseInt(e.value) + 1).toString()), super.set(e, t))
            : super.set(e, t);
        }
      };
    Ho.names = ['order', 'flex-order', 'box-ordinal-group'];
    ug.exports = Ho;
  });
  var pg = v((fI, cg) => {
    l();
    var uC = q(),
      Yo = class extends uC {
        check(e) {
          let t = e.value;
          return (
            !t.toLowerCase().includes('alpha(') &&
            !t.includes('DXImageTransform.Microsoft') &&
            !t.includes('data:image/svg+xml')
          );
        }
      };
    Yo.names = ['filter'];
    cg.exports = Yo;
  });
  var hg = v((cI, dg) => {
    l();
    var fC = q(),
      Qo = class extends fC {
        insert(e, t, i, n) {
          if (t !== '-ms-') return super.insert(e, t, i);
          let s = this.clone(e),
            a = e.prop.replace(/end$/, 'start'),
            o = t + e.prop.replace(/end$/, 'span');
          if (!e.parent.some((u) => u.prop === o)) {
            if (((s.prop = o), e.value.includes('span')))
              s.value = e.value.replace(/span\s/i, '');
            else {
              let u;
              if (
                (e.parent.walkDecls(a, (c) => {
                  u = c;
                }),
                u)
              ) {
                let c = Number(e.value) - Number(u.value) + '';
                s.value = c;
              } else e.warn(n, `Can not prefix ${e.prop} (${a} is not found)`);
            }
            e.cloneBefore(s);
          }
        }
      };
    Qo.names = ['grid-row-end', 'grid-column-end'];
    dg.exports = Qo;
  });
  var gg = v((pI, mg) => {
    l();
    var cC = q(),
      Jo = class extends cC {
        check(e) {
          return !e.value.split(/\s+/).some((t) => {
            let i = t.toLowerCase();
            return i === 'reverse' || i === 'alternate-reverse';
          });
        }
      };
    Jo.names = ['animation', 'animation-direction'];
    mg.exports = Jo;
  });
  var bg = v((dI, yg) => {
    l();
    var pC = de(),
      dC = q(),
      Xo = class extends dC {
        insert(e, t, i) {
          let n;
          if ((([n, t] = pC(t)), n !== 2009)) return super.insert(e, t, i);
          let s = e.value
            .split(/\s+/)
            .filter((p) => p !== 'wrap' && p !== 'nowrap' && 'wrap-reverse');
          if (
            s.length === 0 ||
            e.parent.some(
              (p) =>
                p.prop === t + 'box-orient' || p.prop === t + 'box-direction'
            )
          )
            return;
          let o = s[0],
            u = o.includes('row') ? 'horizontal' : 'vertical',
            c = o.includes('reverse') ? 'reverse' : 'normal',
            f = this.clone(e);
          return (
            (f.prop = t + 'box-orient'),
            (f.value = u),
            this.needCascade(e) && (f.raws.before = this.calcBefore(i, e, t)),
            e.parent.insertBefore(e, f),
            (f = this.clone(e)),
            (f.prop = t + 'box-direction'),
            (f.value = c),
            this.needCascade(e) && (f.raws.before = this.calcBefore(i, e, t)),
            e.parent.insertBefore(e, f)
          );
        }
      };
    Xo.names = ['flex-flow', 'box-direction', 'box-orient'];
    yg.exports = Xo;
  });
  var vg = v((hI, wg) => {
    l();
    var hC = de(),
      mC = q(),
      Ko = class extends mC {
        normalize() {
          return 'flex';
        }
        prefixed(e, t) {
          let i;
          return (
            ([i, t] = hC(t)),
            i === 2009
              ? t + 'box-flex'
              : i === 2012
              ? t + 'flex-positive'
              : super.prefixed(e, t)
          );
        }
      };
    Ko.names = ['flex-grow', 'flex-positive'];
    wg.exports = Ko;
  });
  var kg = v((mI, xg) => {
    l();
    var gC = de(),
      yC = q(),
      Zo = class extends yC {
        set(e, t) {
          if (gC(t)[0] !== 2009) return super.set(e, t);
        }
      };
    Zo.names = ['flex-wrap'];
    xg.exports = Zo;
  });
  var _g = v((gI, Sg) => {
    l();
    var bC = q(),
      Gt = ct(),
      el = class extends bC {
        insert(e, t, i, n) {
          if (t !== '-ms-') return super.insert(e, t, i);
          let s = Gt.parse(e),
            [a, o] = Gt.translate(s, 0, 2),
            [u, c] = Gt.translate(s, 1, 3);
          [
            ['grid-row', a],
            ['grid-row-span', o],
            ['grid-column', u],
            ['grid-column-span', c],
          ].forEach(([f, p]) => {
            Gt.insertDecl(e, f, p);
          }),
            Gt.warnTemplateSelectorNotFound(e, n),
            Gt.warnIfGridRowColumnExists(e, n);
        }
      };
    el.names = ['grid-area'];
    Sg.exports = el;
  });
  var Ag = v((yI, Cg) => {
    l();
    var wC = q(),
      ti = ct(),
      tl = class extends wC {
        insert(e, t, i) {
          if (t !== '-ms-') return super.insert(e, t, i);
          if (e.parent.some((a) => a.prop === '-ms-grid-row-align')) return;
          let [[n, s]] = ti.parse(e);
          s
            ? (ti.insertDecl(e, 'grid-row-align', n),
              ti.insertDecl(e, 'grid-column-align', s))
            : (ti.insertDecl(e, 'grid-row-align', n),
              ti.insertDecl(e, 'grid-column-align', n));
        }
      };
    tl.names = ['place-self'];
    Cg.exports = tl;
  });
  var Eg = v((bI, Og) => {
    l();
    var vC = q(),
      rl = class extends vC {
        check(e) {
          let t = e.value;
          return !t.includes('/') || t.includes('span');
        }
        normalize(e) {
          return e.replace('-start', '');
        }
        prefixed(e, t) {
          let i = super.prefixed(e, t);
          return t === '-ms-' && (i = i.replace('-start', '')), i;
        }
      };
    rl.names = ['grid-row-start', 'grid-column-start'];
    Og.exports = rl;
  });
  var Dg = v((wI, Pg) => {
    l();
    var Tg = de(),
      xC = q(),
      Ht = class extends xC {
        check(e) {
          return (
            e.parent &&
            !e.parent.some((t) => t.prop && t.prop.startsWith('grid-'))
          );
        }
        prefixed(e, t) {
          let i;
          return (
            ([i, t] = Tg(t)),
            i === 2012 ? t + 'flex-item-align' : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'align-self';
        }
        set(e, t) {
          let i = Tg(t)[0];
          if (i === 2012)
            return (
              (e.value = Ht.oldValues[e.value] || e.value), super.set(e, t)
            );
          if (i === 'final') return super.set(e, t);
        }
      };
    Ht.names = ['align-self', 'flex-item-align'];
    Ht.oldValues = { 'flex-end': 'end', 'flex-start': 'start' };
    Pg.exports = Ht;
  });
  var qg = v((vI, Ig) => {
    l();
    var kC = q(),
      SC = ue(),
      il = class extends kC {
        constructor(e, t, i) {
          super(e, t, i);
          this.prefixes &&
            (this.prefixes = SC.uniq(
              this.prefixes.map((n) => (n === '-ms-' ? '-webkit-' : n))
            ));
        }
      };
    il.names = ['appearance'];
    Ig.exports = il;
  });
  var Fg = v((xI, Mg) => {
    l();
    var Rg = de(),
      _C = q(),
      nl = class extends _C {
        normalize() {
          return 'flex-basis';
        }
        prefixed(e, t) {
          let i;
          return (
            ([i, t] = Rg(t)),
            i === 2012 ? t + 'flex-preferred-size' : super.prefixed(e, t)
          );
        }
        set(e, t) {
          let i;
          if ((([i, t] = Rg(t)), i === 2012 || i === 'final'))
            return super.set(e, t);
        }
      };
    nl.names = ['flex-basis', 'flex-preferred-size'];
    Mg.exports = nl;
  });
  var Lg = v((kI, Ng) => {
    l();
    var CC = q(),
      sl = class extends CC {
        normalize() {
          return this.name.replace('box-image', 'border');
        }
        prefixed(e, t) {
          let i = super.prefixed(e, t);
          return t === '-webkit-' && (i = i.replace('border', 'box-image')), i;
        }
      };
    sl.names = [
      'mask-border',
      'mask-border-source',
      'mask-border-slice',
      'mask-border-width',
      'mask-border-outset',
      'mask-border-repeat',
      'mask-box-image',
      'mask-box-image-source',
      'mask-box-image-slice',
      'mask-box-image-width',
      'mask-box-image-outset',
      'mask-box-image-repeat',
    ];
    Ng.exports = sl;
  });
  var $g = v((SI, Bg) => {
    l();
    var AC = q(),
      Be = class extends AC {
        insert(e, t, i) {
          let n = e.prop === 'mask-composite',
            s;
          n ? (s = e.value.split(',')) : (s = e.value.match(Be.regexp) || []),
            (s = s.map((c) => c.trim()).filter((c) => c));
          let a = s.length,
            o;
          if (
            (a &&
              ((o = this.clone(e)),
              (o.value = s.map((c) => Be.oldValues[c] || c).join(', ')),
              s.includes('intersect') && (o.value += ', xor'),
              (o.prop = t + 'mask-composite')),
            n)
          )
            return a
              ? (this.needCascade(e) &&
                  (o.raws.before = this.calcBefore(i, e, t)),
                e.parent.insertBefore(e, o))
              : void 0;
          let u = this.clone(e);
          return (
            (u.prop = t + u.prop),
            a && (u.value = u.value.replace(Be.regexp, '')),
            this.needCascade(e) && (u.raws.before = this.calcBefore(i, e, t)),
            e.parent.insertBefore(e, u),
            a
              ? (this.needCascade(e) &&
                  (o.raws.before = this.calcBefore(i, e, t)),
                e.parent.insertBefore(e, o))
              : e
          );
        }
      };
    Be.names = ['mask', 'mask-composite'];
    Be.oldValues = {
      add: 'source-over',
      subtract: 'source-out',
      intersect: 'source-in',
      exclude: 'xor',
    };
    Be.regexp = new RegExp(
      `\\s+(${Object.keys(Be.oldValues).join('|')})\\b(?!\\))\\s*(?=[,])`,
      'ig'
    );
    Bg.exports = Be;
  });
  var Vg = v((_I, zg) => {
    l();
    var jg = de(),
      OC = q(),
      Yt = class extends OC {
        prefixed(e, t) {
          let i;
          return (
            ([i, t] = jg(t)),
            i === 2009
              ? t + 'box-align'
              : i === 2012
              ? t + 'flex-align'
              : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'align-items';
        }
        set(e, t) {
          let i = jg(t)[0];
          return (
            (i === 2009 || i === 2012) &&
              (e.value = Yt.oldValues[e.value] || e.value),
            super.set(e, t)
          );
        }
      };
    Yt.names = ['align-items', 'flex-align', 'box-align'];
    Yt.oldValues = { 'flex-end': 'end', 'flex-start': 'start' };
    zg.exports = Yt;
  });
  var Wg = v((CI, Ug) => {
    l();
    var EC = q(),
      al = class extends EC {
        set(e, t) {
          return (
            t === '-ms-' && e.value === 'contain' && (e.value = 'element'),
            super.set(e, t)
          );
        }
        insert(e, t, i) {
          if (!(e.value === 'all' && t === '-ms-'))
            return super.insert(e, t, i);
        }
      };
    al.names = ['user-select'];
    Ug.exports = al;
  });
  var Yg = v((AI, Hg) => {
    l();
    var Gg = de(),
      TC = q(),
      ol = class extends TC {
        normalize() {
          return 'flex-shrink';
        }
        prefixed(e, t) {
          let i;
          return (
            ([i, t] = Gg(t)),
            i === 2012 ? t + 'flex-negative' : super.prefixed(e, t)
          );
        }
        set(e, t) {
          let i;
          if ((([i, t] = Gg(t)), i === 2012 || i === 'final'))
            return super.set(e, t);
        }
      };
    ol.names = ['flex-shrink', 'flex-negative'];
    Hg.exports = ol;
  });
  var Jg = v((OI, Qg) => {
    l();
    var PC = q(),
      ll = class extends PC {
        prefixed(e, t) {
          return `${t}column-${e}`;
        }
        normalize(e) {
          return e.includes('inside')
            ? 'break-inside'
            : e.includes('before')
            ? 'break-before'
            : 'break-after';
        }
        set(e, t) {
          return (
            ((e.prop === 'break-inside' && e.value === 'avoid-column') ||
              e.value === 'avoid-page') &&
              (e.value = 'avoid'),
            super.set(e, t)
          );
        }
        insert(e, t, i) {
          if (e.prop !== 'break-inside') return super.insert(e, t, i);
          if (!(/region/i.test(e.value) || /page/i.test(e.value)))
            return super.insert(e, t, i);
        }
      };
    ll.names = [
      'break-inside',
      'page-break-inside',
      'column-break-inside',
      'break-before',
      'page-break-before',
      'column-break-before',
      'break-after',
      'page-break-after',
      'column-break-after',
    ];
    Qg.exports = ll;
  });
  var Kg = v((EI, Xg) => {
    l();
    var DC = q(),
      ul = class extends DC {
        prefixed(e, t) {
          return t + 'print-color-adjust';
        }
        normalize() {
          return 'color-adjust';
        }
      };
    ul.names = ['color-adjust', 'print-color-adjust'];
    Xg.exports = ul;
  });
  var ey = v((TI, Zg) => {
    l();
    var IC = q(),
      Qt = class extends IC {
        insert(e, t, i) {
          if (t === '-ms-') {
            let n = this.set(this.clone(e), t);
            this.needCascade(e) && (n.raws.before = this.calcBefore(i, e, t));
            let s = 'ltr';
            return (
              e.parent.nodes.forEach((a) => {
                a.prop === 'direction' &&
                  (a.value === 'rtl' || a.value === 'ltr') &&
                  (s = a.value);
              }),
              (n.value = Qt.msValues[s][e.value] || e.value),
              e.parent.insertBefore(e, n)
            );
          }
          return super.insert(e, t, i);
        }
      };
    Qt.names = ['writing-mode'];
    Qt.msValues = {
      ltr: {
        'horizontal-tb': 'lr-tb',
        'vertical-rl': 'tb-rl',
        'vertical-lr': 'tb-lr',
      },
      rtl: {
        'horizontal-tb': 'rl-tb',
        'vertical-rl': 'bt-rl',
        'vertical-lr': 'bt-lr',
      },
    };
    Zg.exports = Qt;
  });
  var ry = v((PI, ty) => {
    l();
    var qC = q(),
      fl = class extends qC {
        set(e, t) {
          return (
            (e.value = e.value.replace(/\s+fill(\s)/, '$1')), super.set(e, t)
          );
        }
      };
    fl.names = ['border-image'];
    ty.exports = fl;
  });
  var sy = v((DI, ny) => {
    l();
    var iy = de(),
      RC = q(),
      Jt = class extends RC {
        prefixed(e, t) {
          let i;
          return (
            ([i, t] = iy(t)),
            i === 2012 ? t + 'flex-line-pack' : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'align-content';
        }
        set(e, t) {
          let i = iy(t)[0];
          if (i === 2012)
            return (
              (e.value = Jt.oldValues[e.value] || e.value), super.set(e, t)
            );
          if (i === 'final') return super.set(e, t);
        }
      };
    Jt.names = ['align-content', 'flex-line-pack'];
    Jt.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start',
      'space-between': 'justify',
      'space-around': 'distribute',
    };
    ny.exports = Jt;
  });
  var oy = v((II, ay) => {
    l();
    var MC = q(),
      Se = class extends MC {
        prefixed(e, t) {
          return t === '-moz-'
            ? t + (Se.toMozilla[e] || e)
            : super.prefixed(e, t);
        }
        normalize(e) {
          return Se.toNormal[e] || e;
        }
      };
    Se.names = ['border-radius'];
    Se.toMozilla = {};
    Se.toNormal = {};
    for (let r of ['top', 'bottom'])
      for (let e of ['left', 'right']) {
        let t = `border-${r}-${e}-radius`,
          i = `border-radius-${r}${e}`;
        Se.names.push(t),
          Se.names.push(i),
          (Se.toMozilla[t] = i),
          (Se.toNormal[i] = t);
      }
    ay.exports = Se;
  });
  var uy = v((qI, ly) => {
    l();
    var FC = q(),
      cl = class extends FC {
        prefixed(e, t) {
          return e.includes('-start')
            ? t + e.replace('-block-start', '-before')
            : t + e.replace('-block-end', '-after');
        }
        normalize(e) {
          return e.includes('-before')
            ? e.replace('-before', '-block-start')
            : e.replace('-after', '-block-end');
        }
      };
    cl.names = [
      'border-block-start',
      'border-block-end',
      'margin-block-start',
      'margin-block-end',
      'padding-block-start',
      'padding-block-end',
      'border-before',
      'border-after',
      'margin-before',
      'margin-after',
      'padding-before',
      'padding-after',
    ];
    ly.exports = cl;
  });
  var cy = v((RI, fy) => {
    l();
    var NC = q(),
      {
        parseTemplate: LC,
        warnMissedAreas: BC,
        getGridGap: $C,
        warnGridGap: jC,
        inheritGridGap: zC,
      } = ct(),
      pl = class extends NC {
        insert(e, t, i, n) {
          if (t !== '-ms-') return super.insert(e, t, i);
          if (e.parent.some((h) => h.prop === '-ms-grid-rows')) return;
          let s = $C(e),
            a = zC(e, s),
            { rows: o, columns: u, areas: c } = LC({ decl: e, gap: a || s }),
            f = Object.keys(c).length > 0,
            p = Boolean(o),
            d = Boolean(u);
          return (
            jC({ gap: s, hasColumns: d, decl: e, result: n }),
            BC(c, e, n),
            ((p && d) || f) &&
              e.cloneBefore({ prop: '-ms-grid-rows', value: o, raws: {} }),
            d &&
              e.cloneBefore({ prop: '-ms-grid-columns', value: u, raws: {} }),
            e
          );
        }
      };
    pl.names = ['grid-template'];
    fy.exports = pl;
  });
  var dy = v((MI, py) => {
    l();
    var VC = q(),
      dl = class extends VC {
        prefixed(e, t) {
          return t + e.replace('-inline', '');
        }
        normalize(e) {
          return e.replace(
            /(margin|padding|border)-(start|end)/,
            '$1-inline-$2'
          );
        }
      };
    dl.names = [
      'border-inline-start',
      'border-inline-end',
      'margin-inline-start',
      'margin-inline-end',
      'padding-inline-start',
      'padding-inline-end',
      'border-start',
      'border-end',
      'margin-start',
      'margin-end',
      'padding-start',
      'padding-end',
    ];
    py.exports = dl;
  });
  var my = v((FI, hy) => {
    l();
    var UC = q(),
      hl = class extends UC {
        check(e) {
          return !e.value.includes('flex-') && e.value !== 'baseline';
        }
        prefixed(e, t) {
          return t + 'grid-row-align';
        }
        normalize() {
          return 'align-self';
        }
      };
    hl.names = ['grid-row-align'];
    hy.exports = hl;
  });
  var yy = v((NI, gy) => {
    l();
    var WC = q(),
      Xt = class extends WC {
        keyframeParents(e) {
          let { parent: t } = e;
          for (; t; ) {
            if (t.type === 'atrule' && t.name === 'keyframes') return !0;
            ({ parent: t } = t);
          }
          return !1;
        }
        contain3d(e) {
          if (e.prop === 'transform-origin') return !1;
          for (let t of Xt.functions3d)
            if (e.value.includes(`${t}(`)) return !0;
          return !1;
        }
        set(e, t) {
          return (
            (e = super.set(e, t)),
            t === '-ms-' && (e.value = e.value.replace(/rotatez/gi, 'rotate')),
            e
          );
        }
        insert(e, t, i) {
          if (t === '-ms-') {
            if (!this.contain3d(e) && !this.keyframeParents(e))
              return super.insert(e, t, i);
          } else if (t === '-o-') {
            if (!this.contain3d(e)) return super.insert(e, t, i);
          } else return super.insert(e, t, i);
        }
      };
    Xt.names = ['transform', 'transform-origin'];
    Xt.functions3d = [
      'matrix3d',
      'translate3d',
      'translateZ',
      'scale3d',
      'scaleZ',
      'rotate3d',
      'rotateX',
      'rotateY',
      'perspective',
    ];
    gy.exports = Xt;
  });
  var vy = v((LI, wy) => {
    l();
    var by = de(),
      GC = q(),
      ml = class extends GC {
        normalize() {
          return 'flex-direction';
        }
        insert(e, t, i) {
          let n;
          if ((([n, t] = by(t)), n !== 2009)) return super.insert(e, t, i);
          if (
            e.parent.some(
              (f) =>
                f.prop === t + 'box-orient' || f.prop === t + 'box-direction'
            )
          )
            return;
          let a = e.value,
            o,
            u;
          a === 'inherit' || a === 'initial' || a === 'unset'
            ? ((o = a), (u = a))
            : ((o = a.includes('row') ? 'horizontal' : 'vertical'),
              (u = a.includes('reverse') ? 'reverse' : 'normal'));
          let c = this.clone(e);
          return (
            (c.prop = t + 'box-orient'),
            (c.value = o),
            this.needCascade(e) && (c.raws.before = this.calcBefore(i, e, t)),
            e.parent.insertBefore(e, c),
            (c = this.clone(e)),
            (c.prop = t + 'box-direction'),
            (c.value = u),
            this.needCascade(e) && (c.raws.before = this.calcBefore(i, e, t)),
            e.parent.insertBefore(e, c)
          );
        }
        old(e, t) {
          let i;
          return (
            ([i, t] = by(t)),
            i === 2009
              ? [t + 'box-orient', t + 'box-direction']
              : super.old(e, t)
          );
        }
      };
    ml.names = ['flex-direction', 'box-direction', 'box-orient'];
    wy.exports = ml;
  });
  var ky = v((BI, xy) => {
    l();
    var HC = q(),
      gl = class extends HC {
        check(e) {
          return e.value === 'pixelated';
        }
        prefixed(e, t) {
          return t === '-ms-' ? '-ms-interpolation-mode' : super.prefixed(e, t);
        }
        set(e, t) {
          return t !== '-ms-'
            ? super.set(e, t)
            : ((e.prop = '-ms-interpolation-mode'),
              (e.value = 'nearest-neighbor'),
              e);
        }
        normalize() {
          return 'image-rendering';
        }
        process(e, t) {
          return super.process(e, t);
        }
      };
    gl.names = ['image-rendering', 'interpolation-mode'];
    xy.exports = gl;
  });
  var _y = v(($I, Sy) => {
    l();
    var YC = q(),
      QC = ue(),
      yl = class extends YC {
        constructor(e, t, i) {
          super(e, t, i);
          this.prefixes &&
            (this.prefixes = QC.uniq(
              this.prefixes.map((n) => (n === '-ms-' ? '-webkit-' : n))
            ));
        }
      };
    yl.names = ['backdrop-filter'];
    Sy.exports = yl;
  });
  var Ay = v((jI, Cy) => {
    l();
    var JC = q(),
      XC = ue(),
      bl = class extends JC {
        constructor(e, t, i) {
          super(e, t, i);
          this.prefixes &&
            (this.prefixes = XC.uniq(
              this.prefixes.map((n) => (n === '-ms-' ? '-webkit-' : n))
            ));
        }
        check(e) {
          return e.value.toLowerCase() === 'text';
        }
      };
    bl.names = ['background-clip'];
    Cy.exports = bl;
  });
  var Ey = v((zI, Oy) => {
    l();
    var KC = q(),
      ZC = [
        'none',
        'underline',
        'overline',
        'line-through',
        'blink',
        'inherit',
        'initial',
        'unset',
      ],
      wl = class extends KC {
        check(e) {
          return e.value.split(/\s+/).some((t) => !ZC.includes(t));
        }
      };
    wl.names = ['text-decoration'];
    Oy.exports = wl;
  });
  var Dy = v((VI, Py) => {
    l();
    var Ty = de(),
      eA = q(),
      Kt = class extends eA {
        prefixed(e, t) {
          let i;
          return (
            ([i, t] = Ty(t)),
            i === 2009
              ? t + 'box-pack'
              : i === 2012
              ? t + 'flex-pack'
              : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'justify-content';
        }
        set(e, t) {
          let i = Ty(t)[0];
          if (i === 2009 || i === 2012) {
            let n = Kt.oldValues[e.value] || e.value;
            if (((e.value = n), i !== 2009 || n !== 'distribute'))
              return super.set(e, t);
          } else if (i === 'final') return super.set(e, t);
        }
      };
    Kt.names = ['justify-content', 'flex-pack', 'box-pack'];
    Kt.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start',
      'space-between': 'justify',
      'space-around': 'distribute',
    };
    Py.exports = Kt;
  });
  var qy = v((UI, Iy) => {
    l();
    var tA = q(),
      vl = class extends tA {
        set(e, t) {
          let i = e.value.toLowerCase();
          return (
            t === '-webkit-' &&
              !i.includes(' ') &&
              i !== 'contain' &&
              i !== 'cover' &&
              (e.value = e.value + ' ' + e.value),
            super.set(e, t)
          );
        }
      };
    vl.names = ['background-size'];
    Iy.exports = vl;
  });
  var My = v((WI, Ry) => {
    l();
    var rA = q(),
      xl = ct(),
      kl = class extends rA {
        insert(e, t, i) {
          if (t !== '-ms-') return super.insert(e, t, i);
          let n = xl.parse(e),
            [s, a] = xl.translate(n, 0, 1);
          n[0] &&
            n[0].includes('span') &&
            (a = n[0].join('').replace(/\D/g, '')),
            [
              [e.prop, s],
              [`${e.prop}-span`, a],
            ].forEach(([u, c]) => {
              xl.insertDecl(e, u, c);
            });
        }
      };
    kl.names = ['grid-row', 'grid-column'];
    Ry.exports = kl;
  });
  var Ly = v((GI, Ny) => {
    l();
    var iA = q(),
      {
        prefixTrackProp: Fy,
        prefixTrackValue: nA,
        autoplaceGridItems: sA,
        getGridGap: aA,
        inheritGridGap: oA,
      } = ct(),
      lA = jo(),
      Sl = class extends iA {
        prefixed(e, t) {
          return t === '-ms-'
            ? Fy({ prop: e, prefix: t })
            : super.prefixed(e, t);
        }
        normalize(e) {
          return e.replace(/^grid-(rows|columns)/, 'grid-template-$1');
        }
        insert(e, t, i, n) {
          if (t !== '-ms-') return super.insert(e, t, i);
          let { parent: s, prop: a, value: o } = e,
            u = a.includes('rows'),
            c = a.includes('columns'),
            f = s.some(
              (k) =>
                k.prop === 'grid-template' || k.prop === 'grid-template-areas'
            );
          if (f && u) return !1;
          let p = new lA({ options: {} }),
            d = p.gridStatus(s, n),
            h = aA(e);
          h = oA(e, h) || h;
          let y = u ? h.row : h.column;
          (d === 'no-autoplace' || d === !0) && !f && (y = null);
          let x = nA({ value: o, gap: y });
          e.cloneBefore({ prop: Fy({ prop: a, prefix: t }), value: x });
          let b = s.nodes.find((k) => k.prop === 'grid-auto-flow'),
            w = 'row';
          if (
            (b && !p.disabled(b, n) && (w = b.value.trim()), d === 'autoplace')
          ) {
            let k = s.nodes.find((_) => _.prop === 'grid-template-rows');
            if (!k && f) return;
            if (!k && !f) {
              e.warn(
                n,
                'Autoplacement does not work without grid-template-rows property'
              );
              return;
            }
            !s.nodes.find((_) => _.prop === 'grid-template-columns') &&
              !f &&
              e.warn(
                n,
                'Autoplacement does not work without grid-template-columns property'
              ),
              c && !f && sA(e, n, h, w);
          }
        }
      };
    Sl.names = [
      'grid-template-rows',
      'grid-template-columns',
      'grid-rows',
      'grid-columns',
    ];
    Ny.exports = Sl;
  });
  var $y = v((HI, By) => {
    l();
    var uA = q(),
      _l = class extends uA {
        check(e) {
          return !e.value.includes('flex-') && e.value !== 'baseline';
        }
        prefixed(e, t) {
          return t + 'grid-column-align';
        }
        normalize() {
          return 'justify-self';
        }
      };
    _l.names = ['grid-column-align'];
    By.exports = _l;
  });
  var zy = v((YI, jy) => {
    l();
    var fA = q(),
      Cl = class extends fA {
        prefixed(e, t) {
          return t + 'scroll-chaining';
        }
        normalize() {
          return 'overscroll-behavior';
        }
        set(e, t) {
          return (
            e.value === 'auto'
              ? (e.value = 'chained')
              : (e.value === 'none' || e.value === 'contain') &&
                (e.value = 'none'),
            super.set(e, t)
          );
        }
      };
    Cl.names = ['overscroll-behavior', 'scroll-chaining'];
    jy.exports = Cl;
  });
  var Wy = v((QI, Uy) => {
    l();
    var cA = q(),
      {
        parseGridAreas: pA,
        warnMissedAreas: dA,
        prefixTrackProp: hA,
        prefixTrackValue: Vy,
        getGridGap: mA,
        warnGridGap: gA,
        inheritGridGap: yA,
      } = ct();
    function bA(r) {
      return r
        .trim()
        .slice(1, -1)
        .split(/["']\s*["']?/g);
    }
    var Al = class extends cA {
      insert(e, t, i, n) {
        if (t !== '-ms-') return super.insert(e, t, i);
        let s = !1,
          a = !1,
          o = e.parent,
          u = mA(e);
        (u = yA(e, u) || u),
          o.walkDecls(/-ms-grid-rows/, (p) => p.remove()),
          o.walkDecls(/grid-template-(rows|columns)/, (p) => {
            if (p.prop === 'grid-template-rows') {
              a = !0;
              let { prop: d, value: h } = p;
              p.cloneBefore({
                prop: hA({ prop: d, prefix: t }),
                value: Vy({ value: h, gap: u.row }),
              });
            } else s = !0;
          });
        let c = bA(e.value);
        s &&
          !a &&
          u.row &&
          c.length > 1 &&
          e.cloneBefore({
            prop: '-ms-grid-rows',
            value: Vy({ value: `repeat(${c.length}, auto)`, gap: u.row }),
            raws: {},
          }),
          gA({ gap: u, hasColumns: s, decl: e, result: n });
        let f = pA({ rows: c, gap: u });
        return dA(f, e, n), e;
      }
    };
    Al.names = ['grid-template-areas'];
    Uy.exports = Al;
  });
  var Hy = v((JI, Gy) => {
    l();
    var wA = q(),
      Ol = class extends wA {
        set(e, t) {
          return (
            t === '-webkit-' &&
              (e.value = e.value.replace(/\s*(right|left)\s*/i, '')),
            super.set(e, t)
          );
        }
      };
    Ol.names = ['text-emphasis-position'];
    Gy.exports = Ol;
  });
  var Qy = v((XI, Yy) => {
    l();
    var vA = q(),
      El = class extends vA {
        set(e, t) {
          return e.prop === 'text-decoration-skip-ink' && e.value === 'auto'
            ? ((e.prop = t + 'text-decoration-skip'), (e.value = 'ink'), e)
            : super.set(e, t);
        }
      };
    El.names = ['text-decoration-skip-ink', 'text-decoration-skip'];
    Yy.exports = El;
  });
  var tb = v((KI, eb) => {
    l();
    ('use strict');
    eb.exports = {
      wrap: Jy,
      limit: Xy,
      validate: Ky,
      test: Tl,
      curry: xA,
      name: Zy,
    };
    function Jy(r, e, t) {
      var i = e - r;
      return ((((t - r) % i) + i) % i) + r;
    }
    function Xy(r, e, t) {
      return Math.max(r, Math.min(e, t));
    }
    function Ky(r, e, t, i, n) {
      if (!Tl(r, e, t, i, n))
        throw new Error(t + ' is outside of range [' + r + ',' + e + ')');
      return t;
    }
    function Tl(r, e, t, i, n) {
      return !(t < r || t > e || (n && t === e) || (i && t === r));
    }
    function Zy(r, e, t, i) {
      return (t ? '(' : '[') + r + ',' + e + (i ? ')' : ']');
    }
    function xA(r, e, t, i) {
      var n = Zy.bind(null, r, e, t, i);
      return {
        wrap: Jy.bind(null, r, e),
        limit: Xy.bind(null, r, e),
        validate: function (s) {
          return Ky(r, e, s, t, i);
        },
        test: function (s) {
          return Tl(r, e, s, t, i);
        },
        toString: n,
        name: n,
      };
    }
  });
  var nb = v((ZI, ib) => {
    l();
    var Pl = Kr(),
      kA = tb(),
      SA = Vt(),
      _A = ke(),
      CA = ue(),
      rb = /top|left|right|bottom/gi,
      Ye = class extends _A {
        replace(e, t) {
          let i = Pl(e);
          for (let n of i.nodes)
            if (n.type === 'function' && n.value === this.name)
              if (
                ((n.nodes = this.newDirection(n.nodes)),
                (n.nodes = this.normalize(n.nodes)),
                t === '-webkit- old')
              ) {
                if (!this.oldWebkit(n)) return !1;
              } else
                (n.nodes = this.convertDirection(n.nodes)),
                  (n.value = t + n.value);
          return i.toString();
        }
        replaceFirst(e, ...t) {
          return t
            .map((n) =>
              n === ' '
                ? { type: 'space', value: n }
                : { type: 'word', value: n }
            )
            .concat(e.slice(1));
        }
        normalizeUnit(e, t) {
          return `${(parseFloat(e) / t) * 360}deg`;
        }
        normalize(e) {
          if (!e[0]) return e;
          if (/-?\d+(.\d+)?grad/.test(e[0].value))
            e[0].value = this.normalizeUnit(e[0].value, 400);
          else if (/-?\d+(.\d+)?rad/.test(e[0].value))
            e[0].value = this.normalizeUnit(e[0].value, 2 * Math.PI);
          else if (/-?\d+(.\d+)?turn/.test(e[0].value))
            e[0].value = this.normalizeUnit(e[0].value, 1);
          else if (e[0].value.includes('deg')) {
            let t = parseFloat(e[0].value);
            (t = kA.wrap(0, 360, t)), (e[0].value = `${t}deg`);
          }
          return (
            e[0].value === '0deg'
              ? (e = this.replaceFirst(e, 'to', ' ', 'top'))
              : e[0].value === '90deg'
              ? (e = this.replaceFirst(e, 'to', ' ', 'right'))
              : e[0].value === '180deg'
              ? (e = this.replaceFirst(e, 'to', ' ', 'bottom'))
              : e[0].value === '270deg' &&
                (e = this.replaceFirst(e, 'to', ' ', 'left')),
            e
          );
        }
        newDirection(e) {
          if (e[0].value === 'to' || ((rb.lastIndex = 0), !rb.test(e[0].value)))
            return e;
          e.unshift(
            { type: 'word', value: 'to' },
            { type: 'space', value: ' ' }
          );
          for (let t = 2; t < e.length && e[t].type !== 'div'; t++)
            e[t].type === 'word' &&
              (e[t].value = this.revertDirection(e[t].value));
          return e;
        }
        isRadial(e) {
          let t = 'before';
          for (let i of e)
            if (t === 'before' && i.type === 'space') t = 'at';
            else if (t === 'at' && i.value === 'at') t = 'after';
            else {
              if (t === 'after' && i.type === 'space') return !0;
              if (i.type === 'div') break;
              t = 'before';
            }
          return !1;
        }
        convertDirection(e) {
          return (
            e.length > 0 &&
              (e[0].value === 'to'
                ? this.fixDirection(e)
                : e[0].value.includes('deg')
                ? this.fixAngle(e)
                : this.isRadial(e) && this.fixRadial(e)),
            e
          );
        }
        fixDirection(e) {
          e.splice(0, 2);
          for (let t of e) {
            if (t.type === 'div') break;
            t.type === 'word' && (t.value = this.revertDirection(t.value));
          }
        }
        fixAngle(e) {
          let t = e[0].value;
          (t = parseFloat(t)),
            (t = Math.abs(450 - t) % 360),
            (t = this.roundFloat(t, 3)),
            (e[0].value = `${t}deg`);
        }
        fixRadial(e) {
          let t = [],
            i = [],
            n,
            s,
            a,
            o,
            u;
          for (o = 0; o < e.length - 2; o++)
            if (
              ((n = e[o]),
              (s = e[o + 1]),
              (a = e[o + 2]),
              n.type === 'space' && s.value === 'at' && a.type === 'space')
            ) {
              u = o + 3;
              break;
            } else t.push(n);
          let c;
          for (o = u; o < e.length; o++)
            if (e[o].type === 'div') {
              c = e[o];
              break;
            } else i.push(e[o]);
          e.splice(0, o, ...i, c, ...t);
        }
        revertDirection(e) {
          return Ye.directions[e.toLowerCase()] || e;
        }
        roundFloat(e, t) {
          return parseFloat(e.toFixed(t));
        }
        oldWebkit(e) {
          let { nodes: t } = e,
            i = Pl.stringify(e.nodes);
          if (
            this.name !== 'linear-gradient' ||
            (t[0] && t[0].value.includes('deg')) ||
            i.includes('px') ||
            i.includes('-corner') ||
            i.includes('-side')
          )
            return !1;
          let n = [[]];
          for (let s of t)
            n[n.length - 1].push(s),
              s.type === 'div' && s.value === ',' && n.push([]);
          this.oldDirection(n), this.colorStops(n), (e.nodes = []);
          for (let s of n) e.nodes = e.nodes.concat(s);
          return (
            e.nodes.unshift(
              { type: 'word', value: 'linear' },
              this.cloneDiv(e.nodes)
            ),
            (e.value = '-webkit-gradient'),
            !0
          );
        }
        oldDirection(e) {
          let t = this.cloneDiv(e[0]);
          if (e[0][0].value !== 'to')
            return e.unshift([
              { type: 'word', value: Ye.oldDirections.bottom },
              t,
            ]);
          {
            let i = [];
            for (let s of e[0].slice(2))
              s.type === 'word' && i.push(s.value.toLowerCase());
            i = i.join(' ');
            let n = Ye.oldDirections[i] || i;
            return (e[0] = [{ type: 'word', value: n }, t]), e[0];
          }
        }
        cloneDiv(e) {
          for (let t of e) if (t.type === 'div' && t.value === ',') return t;
          return { type: 'div', value: ',', after: ' ' };
        }
        colorStops(e) {
          let t = [];
          for (let i = 0; i < e.length; i++) {
            let n,
              s = e[i],
              a;
            if (i === 0) continue;
            let o = Pl.stringify(s[0]);
            s[1] && s[1].type === 'word'
              ? (n = s[1].value)
              : s[2] && s[2].type === 'word' && (n = s[2].value);
            let u;
            i === 1 && (!n || n === '0%')
              ? (u = `from(${o})`)
              : i === e.length - 1 && (!n || n === '100%')
              ? (u = `to(${o})`)
              : n
              ? (u = `color-stop(${n}, ${o})`)
              : (u = `color-stop(${o})`);
            let c = s[s.length - 1];
            (e[i] = [{ type: 'word', value: u }]),
              c.type === 'div' && c.value === ',' && (a = e[i].push(c)),
              t.push(a);
          }
          return t;
        }
        old(e) {
          if (e === '-webkit-') {
            let t = this.name === 'linear-gradient' ? 'linear' : 'radial',
              i = '-gradient',
              n = CA.regexp(`-webkit-(${t}-gradient|gradient\\(\\s*${t})`, !1);
            return new SA(this.name, e + this.name, i, n);
          } else return super.old(e);
        }
        add(e, t) {
          let i = e.prop;
          if (i.includes('mask')) {
            if (t === '-webkit-' || t === '-webkit- old')
              return super.add(e, t);
          } else if (
            i === 'list-style' ||
            i === 'list-style-image' ||
            i === 'content'
          ) {
            if (t === '-webkit-' || t === '-webkit- old')
              return super.add(e, t);
          } else return super.add(e, t);
        }
      };
    Ye.names = [
      'linear-gradient',
      'repeating-linear-gradient',
      'radial-gradient',
      'repeating-radial-gradient',
    ];
    Ye.directions = {
      top: 'bottom',
      left: 'right',
      bottom: 'top',
      right: 'left',
    };
    Ye.oldDirections = {
      top: 'left bottom, left top',
      left: 'right top, left top',
      bottom: 'left top, left bottom',
      right: 'left top, right top',
      'top right': 'left bottom, right top',
      'top left': 'right bottom, left top',
      'right top': 'left bottom, right top',
      'right bottom': 'left top, right bottom',
      'bottom right': 'left top, right bottom',
      'bottom left': 'right top, left bottom',
      'left top': 'right bottom, left top',
      'left bottom': 'right top, left bottom',
    };
    ib.exports = Ye;
  });
  var ob = v((eq, ab) => {
    l();
    var AA = Vt(),
      OA = ke();
    function sb(r) {
      return new RegExp(`(^|[\\s,(])(${r}($|[\\s),]))`, 'gi');
    }
    var Dl = class extends OA {
      regexp() {
        return (
          this.regexpCache || (this.regexpCache = sb(this.name)),
          this.regexpCache
        );
      }
      isStretch() {
        return (
          this.name === 'stretch' ||
          this.name === 'fill' ||
          this.name === 'fill-available'
        );
      }
      replace(e, t) {
        return t === '-moz-' && this.isStretch()
          ? e.replace(this.regexp(), '$1-moz-available$3')
          : t === '-webkit-' && this.isStretch()
          ? e.replace(this.regexp(), '$1-webkit-fill-available$3')
          : super.replace(e, t);
      }
      old(e) {
        let t = e + this.name;
        return (
          this.isStretch() &&
            (e === '-moz-'
              ? (t = '-moz-available')
              : e === '-webkit-' && (t = '-webkit-fill-available')),
          new AA(this.name, t, t, sb(t))
        );
      }
      add(e, t) {
        if (!(e.prop.includes('grid') && t !== '-webkit-'))
          return super.add(e, t);
      }
    };
    Dl.names = [
      'max-content',
      'min-content',
      'fit-content',
      'fill',
      'fill-available',
      'stretch',
    ];
    ab.exports = Dl;
  });
  var fb = v((tq, ub) => {
    l();
    var lb = Vt(),
      EA = ke(),
      Il = class extends EA {
        replace(e, t) {
          return t === '-webkit-'
            ? e.replace(this.regexp(), '$1-webkit-optimize-contrast')
            : t === '-moz-'
            ? e.replace(this.regexp(), '$1-moz-crisp-edges')
            : super.replace(e, t);
        }
        old(e) {
          return e === '-webkit-'
            ? new lb(this.name, '-webkit-optimize-contrast')
            : e === '-moz-'
            ? new lb(this.name, '-moz-crisp-edges')
            : super.old(e);
        }
      };
    Il.names = ['pixelated'];
    ub.exports = Il;
  });
  var pb = v((rq, cb) => {
    l();
    var TA = ke(),
      ql = class extends TA {
        replace(e, t) {
          let i = super.replace(e, t);
          return (
            t === '-webkit-' &&
              (i = i.replace(/("[^"]+"|'[^']+')(\s+\d+\w)/gi, 'url($1)$2')),
            i
          );
        }
      };
    ql.names = ['image-set'];
    cb.exports = ql;
  });
  var hb = v((iq, db) => {
    l();
    var PA = me().list,
      DA = ke(),
      Rl = class extends DA {
        replace(e, t) {
          return PA.space(e)
            .map((i) => {
              if (i.slice(0, +this.name.length + 1) !== this.name + '(')
                return i;
              let n = i.lastIndexOf(')'),
                s = i.slice(n + 1),
                a = i.slice(this.name.length + 1, n);
              if (t === '-webkit-') {
                let o = a.match(/\d*.?\d+%?/);
                o
                  ? ((a = a.slice(o[0].length).trim()), (a += `, ${o[0]}`))
                  : (a += ', 0.5');
              }
              return t + this.name + '(' + a + ')' + s;
            })
            .join(' ');
        }
      };
    Rl.names = ['cross-fade'];
    db.exports = Rl;
  });
  var gb = v((nq, mb) => {
    l();
    var IA = de(),
      qA = Vt(),
      RA = ke(),
      Ml = class extends RA {
        constructor(e, t) {
          super(e, t);
          e === 'display-flex' && (this.name = 'flex');
        }
        check(e) {
          return e.prop === 'display' && e.value === this.name;
        }
        prefixed(e) {
          let t, i;
          return (
            ([t, e] = IA(e)),
            t === 2009
              ? this.name === 'flex'
                ? (i = 'box')
                : (i = 'inline-box')
              : t === 2012
              ? this.name === 'flex'
                ? (i = 'flexbox')
                : (i = 'inline-flexbox')
              : t === 'final' && (i = this.name),
            e + i
          );
        }
        replace(e, t) {
          return this.prefixed(t);
        }
        old(e) {
          let t = this.prefixed(e);
          if (!!t) return new qA(this.name, t);
        }
      };
    Ml.names = ['display-flex', 'inline-flex'];
    mb.exports = Ml;
  });
  var bb = v((sq, yb) => {
    l();
    var MA = ke(),
      Fl = class extends MA {
        constructor(e, t) {
          super(e, t);
          e === 'display-grid' && (this.name = 'grid');
        }
        check(e) {
          return e.prop === 'display' && e.value === this.name;
        }
      };
    Fl.names = ['display-grid', 'inline-grid'];
    yb.exports = Fl;
  });
  var vb = v((aq, wb) => {
    l();
    var FA = ke(),
      Nl = class extends FA {
        constructor(e, t) {
          super(e, t);
          e === 'filter-function' && (this.name = 'filter');
        }
      };
    Nl.names = ['filter', 'filter-function'];
    wb.exports = Nl;
  });
  var _b = v((oq, Sb) => {
    l();
    var xb = ei(),
      R = q(),
      kb = gm(),
      NA = xm(),
      LA = jo(),
      BA = $m(),
      Ll = ft(),
      Zt = Ut(),
      $A = Ym(),
      $e = ke(),
      er = ue(),
      jA = Jm(),
      zA = Km(),
      VA = eg(),
      UA = rg(),
      WA = og(),
      GA = fg(),
      HA = pg(),
      YA = hg(),
      QA = gg(),
      JA = bg(),
      XA = vg(),
      KA = kg(),
      ZA = _g(),
      eO = Ag(),
      tO = Eg(),
      rO = Dg(),
      iO = qg(),
      nO = Fg(),
      sO = Lg(),
      aO = $g(),
      oO = Vg(),
      lO = Wg(),
      uO = Yg(),
      fO = Jg(),
      cO = Kg(),
      pO = ey(),
      dO = ry(),
      hO = sy(),
      mO = oy(),
      gO = uy(),
      yO = cy(),
      bO = dy(),
      wO = my(),
      vO = yy(),
      xO = vy(),
      kO = ky(),
      SO = _y(),
      _O = Ay(),
      CO = Ey(),
      AO = Dy(),
      OO = qy(),
      EO = My(),
      TO = Ly(),
      PO = $y(),
      DO = zy(),
      IO = Wy(),
      qO = Hy(),
      RO = Qy(),
      MO = nb(),
      FO = ob(),
      NO = fb(),
      LO = pb(),
      BO = hb(),
      $O = gb(),
      jO = bb(),
      zO = vb();
    Zt.hack(jA);
    Zt.hack(zA);
    Zt.hack(VA);
    Zt.hack(UA);
    R.hack(WA);
    R.hack(GA);
    R.hack(HA);
    R.hack(YA);
    R.hack(QA);
    R.hack(JA);
    R.hack(XA);
    R.hack(KA);
    R.hack(ZA);
    R.hack(eO);
    R.hack(tO);
    R.hack(rO);
    R.hack(iO);
    R.hack(nO);
    R.hack(sO);
    R.hack(aO);
    R.hack(oO);
    R.hack(lO);
    R.hack(uO);
    R.hack(fO);
    R.hack(cO);
    R.hack(pO);
    R.hack(dO);
    R.hack(hO);
    R.hack(mO);
    R.hack(gO);
    R.hack(yO);
    R.hack(bO);
    R.hack(wO);
    R.hack(vO);
    R.hack(xO);
    R.hack(kO);
    R.hack(SO);
    R.hack(_O);
    R.hack(CO);
    R.hack(AO);
    R.hack(OO);
    R.hack(EO);
    R.hack(TO);
    R.hack(PO);
    R.hack(DO);
    R.hack(IO);
    R.hack(qO);
    R.hack(RO);
    $e.hack(MO);
    $e.hack(FO);
    $e.hack(NO);
    $e.hack(LO);
    $e.hack(BO);
    $e.hack($O);
    $e.hack(jO);
    $e.hack(zO);
    var Bl = new Map(),
      ri = class {
        constructor(e, t, i = {}) {
          (this.data = e),
            (this.browsers = t),
            (this.options = i),
            ([this.add, this.remove] = this.preprocess(this.select(this.data))),
            (this.transition = new NA(this)),
            (this.processor = new LA(this));
        }
        cleaner() {
          if (this.cleanerCache) return this.cleanerCache;
          if (this.browsers.selected.length) {
            let e = new Ll(this.browsers.data, []);
            this.cleanerCache = new ri(this.data, e, this.options);
          } else return this;
          return this.cleanerCache;
        }
        select(e) {
          let t = { add: {}, remove: {} };
          for (let i in e) {
            let n = e[i],
              s = n.browsers.map((u) => {
                let c = u.split(' ');
                return { browser: `${c[0]} ${c[1]}`, note: c[2] };
              }),
              a = s
                .filter((u) => u.note)
                .map((u) => `${this.browsers.prefix(u.browser)} ${u.note}`);
            (a = er.uniq(a)),
              (s = s
                .filter((u) => this.browsers.isSelected(u.browser))
                .map((u) => {
                  let c = this.browsers.prefix(u.browser);
                  return u.note ? `${c} ${u.note}` : c;
                })),
              (s = this.sort(er.uniq(s))),
              this.options.flexbox === 'no-2009' &&
                (s = s.filter((u) => !u.includes('2009')));
            let o = n.browsers.map((u) => this.browsers.prefix(u));
            n.mistakes && (o = o.concat(n.mistakes)),
              (o = o.concat(a)),
              (o = er.uniq(o)),
              s.length
                ? ((t.add[i] = s),
                  s.length < o.length &&
                    (t.remove[i] = o.filter((u) => !s.includes(u))))
                : (t.remove[i] = o);
          }
          return t;
        }
        sort(e) {
          return e.sort((t, i) => {
            let n = er.removeNote(t).length,
              s = er.removeNote(i).length;
            return n === s ? i.length - t.length : s - n;
          });
        }
        preprocess(e) {
          let t = { selectors: [], '@supports': new BA(ri, this) };
          for (let n in e.add) {
            let s = e.add[n];
            if (n === '@keyframes' || n === '@viewport')
              t[n] = new $A(n, s, this);
            else if (n === '@resolution') t[n] = new kb(n, s, this);
            else if (this.data[n].selector)
              t.selectors.push(Zt.load(n, s, this));
            else {
              let a = this.data[n].props;
              if (a) {
                let o = $e.load(n, s, this);
                for (let u of a)
                  t[u] || (t[u] = { values: [] }), t[u].values.push(o);
              } else {
                let o = (t[n] && t[n].values) || [];
                (t[n] = R.load(n, s, this)), (t[n].values = o);
              }
            }
          }
          let i = { selectors: [] };
          for (let n in e.remove) {
            let s = e.remove[n];
            if (this.data[n].selector) {
              let a = Zt.load(n, s);
              for (let o of s) i.selectors.push(a.old(o));
            } else if (n === '@keyframes' || n === '@viewport')
              for (let a of s) {
                let o = `@${a}${n.slice(1)}`;
                i[o] = { remove: !0 };
              }
            else if (n === '@resolution') i[n] = new kb(n, s, this);
            else {
              let a = this.data[n].props;
              if (a) {
                let o = $e.load(n, [], this);
                for (let u of s) {
                  let c = o.old(u);
                  if (c)
                    for (let f of a)
                      i[f] || (i[f] = {}),
                        i[f].values || (i[f].values = []),
                        i[f].values.push(c);
                }
              } else
                for (let o of s) {
                  let u = this.decl(n).old(n, o);
                  if (n === 'align-self') {
                    let c = t[n] && t[n].prefixes;
                    if (c) {
                      if (o === '-webkit- 2009' && c.includes('-webkit-'))
                        continue;
                      if (o === '-webkit-' && c.includes('-webkit- 2009'))
                        continue;
                    }
                  }
                  for (let c of u) i[c] || (i[c] = {}), (i[c].remove = !0);
                }
            }
          }
          return [t, i];
        }
        decl(e) {
          return Bl.has(e) || Bl.set(e, R.load(e)), Bl.get(e);
        }
        unprefixed(e) {
          let t = this.normalize(xb.unprefixed(e));
          return t === 'flex-direction' && (t = 'flex-flow'), t;
        }
        normalize(e) {
          return this.decl(e).normalize(e);
        }
        prefixed(e, t) {
          return (e = xb.unprefixed(e)), this.decl(e).prefixed(e, t);
        }
        values(e, t) {
          let i = this[e],
            n = i['*'] && i['*'].values,
            s = i[t] && i[t].values;
          return n && s ? er.uniq(n.concat(s)) : n || s || [];
        }
        group(e) {
          let t = e.parent,
            i = t.index(e),
            { length: n } = t.nodes,
            s = this.unprefixed(e.prop),
            a = (o, u) => {
              for (i += o; i >= 0 && i < n; ) {
                let c = t.nodes[i];
                if (c.type === 'decl') {
                  if (
                    (o === -1 && c.prop === s && !Ll.withPrefix(c.value)) ||
                    this.unprefixed(c.prop) !== s
                  )
                    break;
                  if (u(c) === !0) return !0;
                  if (o === 1 && c.prop === s && !Ll.withPrefix(c.value)) break;
                }
                i += o;
              }
              return !1;
            };
          return {
            up(o) {
              return a(-1, o);
            },
            down(o) {
              return a(1, o);
            },
          };
        }
      };
    Sb.exports = ri;
  });
  var Ab = v((lq, Cb) => {
    l();
    Cb.exports = {
      'backface-visibility': {
        mistakes: ['-ms-', '-o-'],
        feature: 'transforms3d',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7', 'safari 14.1'],
      },
      'backdrop-filter': {
        feature: 'css-backdrop-filter',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7', 'safari 14.1'],
      },
      element: {
        props: [
          'background',
          'background-image',
          'border-image',
          'mask',
          'list-style',
          'list-style-image',
          'content',
          'mask-image',
        ],
        feature: 'css-element-function',
        browsers: ['firefox 89'],
      },
      'user-select': {
        mistakes: ['-khtml-'],
        feature: 'user-select-none',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7', 'safari 14.1'],
      },
      'background-clip': {
        feature: 'background-clip-text',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      hyphens: {
        feature: 'css-hyphens',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7', 'safari 14.1'],
      },
      ':fullscreen': {
        selector: !0,
        feature: 'fullscreen',
        browsers: ['and_chr 92', 'and_uc 12.12', 'safari 14.1'],
      },
      '::backdrop': {
        selector: !0,
        feature: 'fullscreen',
        browsers: ['and_chr 92', 'and_uc 12.12', 'safari 14.1'],
      },
      '::file-selector-button': {
        selector: !0,
        feature: 'fullscreen',
        browsers: ['safari 14.1'],
      },
      'tab-size': { feature: 'css3-tabsize', browsers: ['firefox 89'] },
      fill: {
        props: [
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
          'inline-size',
          'min-inline-size',
          'max-inline-size',
          'block-size',
          'min-block-size',
          'max-block-size',
          'grid',
          'grid-template',
          'grid-template-rows',
          'grid-template-columns',
          'grid-auto-columns',
          'grid-auto-rows',
        ],
        feature: 'intrinsic-width',
        browsers: [
          'and_chr 92',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'samsung 14.0',
        ],
      },
      'fill-available': {
        props: [
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
          'inline-size',
          'min-inline-size',
          'max-inline-size',
          'block-size',
          'min-block-size',
          'max-block-size',
          'grid',
          'grid-template',
          'grid-template-rows',
          'grid-template-columns',
          'grid-auto-columns',
          'grid-auto-rows',
        ],
        feature: 'intrinsic-width',
        browsers: [
          'and_chr 92',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'samsung 14.0',
        ],
      },
      stretch: {
        props: [
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
          'inline-size',
          'min-inline-size',
          'max-inline-size',
          'block-size',
          'min-block-size',
          'max-block-size',
          'grid',
          'grid-template',
          'grid-template-rows',
          'grid-template-columns',
          'grid-auto-columns',
          'grid-auto-rows',
        ],
        feature: 'intrinsic-width',
        browsers: ['firefox 89'],
      },
      'fit-content': {
        props: [
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
          'inline-size',
          'min-inline-size',
          'max-inline-size',
          'block-size',
          'min-block-size',
          'max-block-size',
          'grid',
          'grid-template',
          'grid-template-rows',
          'grid-template-columns',
          'grid-auto-columns',
          'grid-auto-rows',
        ],
        feature: 'intrinsic-width',
        browsers: ['firefox 89'],
      },
      'text-decoration-style': {
        feature: 'text-decoration',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7'],
      },
      'text-decoration-color': {
        feature: 'text-decoration',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7'],
      },
      'text-decoration-line': {
        feature: 'text-decoration',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7'],
      },
      'text-decoration': {
        feature: 'text-decoration',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7'],
      },
      'text-decoration-skip': {
        feature: 'text-decoration',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7'],
      },
      'text-decoration-skip-ink': {
        feature: 'text-decoration',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7'],
      },
      'text-size-adjust': {
        feature: 'text-size-adjust',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7'],
      },
      'mask-clip': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-composite': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-image': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-origin': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-repeat': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-border-repeat': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-border-source': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      mask: {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-position': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-size': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-border': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-border-outset': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-border-width': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'mask-border-slice': {
        feature: 'css-masks',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'clip-path': {
        feature: 'css-clip-path',
        browsers: [
          'and_uc 12.12',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'box-decoration-break': {
        feature: 'css-boxdecorationbreak',
        browsers: [
          'and_chr 92',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      '@resolution': {
        feature: 'css-media-resolution',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7', 'safari 14.1'],
      },
      'border-inline-start': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      'border-inline-end': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      'margin-inline-start': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      'margin-inline-end': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      'padding-inline-start': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      'padding-inline-end': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      'border-block-start': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      'border-block-end': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      'margin-block-start': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      'margin-block-end': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      'padding-block-start': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      'padding-block-end': {
        feature: 'css-logical-props',
        browsers: ['and_uc 12.12'],
      },
      appearance: {
        feature: 'css-appearance',
        browsers: [
          'and_uc 12.12',
          'ios_saf 14.0-14.4',
          'ios_saf 14.5-14.7',
          'safari 14.1',
          'samsung 14.0',
        ],
      },
      'image-set': {
        props: [
          'background',
          'background-image',
          'border-image',
          'cursor',
          'mask',
          'mask-image',
          'list-style',
          'list-style-image',
          'content',
        ],
        feature: 'css-image-set',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'samsung 14.0',
        ],
      },
      'cross-fade': {
        props: [
          'background',
          'background-image',
          'border-image',
          'mask',
          'list-style',
          'list-style-image',
          'content',
          'mask-image',
        ],
        feature: 'css-cross-fade',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'samsung 14.0',
        ],
      },
      'text-emphasis': {
        feature: 'text-emphasis',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'samsung 14.0',
        ],
      },
      'text-emphasis-position': {
        feature: 'text-emphasis',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'samsung 14.0',
        ],
      },
      'text-emphasis-style': {
        feature: 'text-emphasis',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'samsung 14.0',
        ],
      },
      'text-emphasis-color': {
        feature: 'text-emphasis',
        browsers: [
          'and_chr 92',
          'and_uc 12.12',
          'chrome 91',
          'chrome 92',
          'edge 91',
          'samsung 14.0',
        ],
      },
      ':any-link': {
        selector: !0,
        feature: 'css-any-link',
        browsers: ['and_uc 12.12'],
      },
      isolate: {
        props: ['unicode-bidi'],
        feature: 'css-unicode-bidi',
        browsers: ['ios_saf 14.0-14.4', 'ios_saf 14.5-14.7', 'safari 14.1'],
      },
      'color-adjust': {
        feature: 'css-color-adjust',
        browsers: ['chrome 91', 'chrome 92', 'edge 91', 'safari 14.1'],
      },
    };
  });
  var Eb = v((uq, Ob) => {
    l();
    Ob.exports = {};
  });
  var Ib = v((fq, Db) => {
    l();
    var VO = Fo(),
      { agents: UO } = (Ln(), Nn),
      $l = rm(),
      WO = ft(),
      GO = _b(),
      HO = Ab(),
      YO = Eb(),
      Tb = { browsers: UO, prefixes: HO },
      Pb = `
  Replace Autoprefixer \`browsers\` option to Browserslist config.
  Use \`browserslist\` key in \`package.json\` or \`.browserslistrc\` file.

  Using \`browsers\` option can cause errors. Browserslist config can
  be used for Babel, Autoprefixer, postcss-normalize and other tools.

  If you really need to use option, rename it to \`overrideBrowserslist\`.

  Learn more at:
  https://github.com/browserslist/browserslist#readme
  https://twitter.com/browserslist

`;
    function QO(r) {
      return Object.prototype.toString.apply(r) === '[object Object]';
    }
    var jl = new Map();
    function JO(r, e) {
      e.browsers.selected.length !== 0 &&
        (e.add.selectors.length > 0 ||
          Object.keys(e.add).length > 2 ||
          r.warn(`Autoprefixer target browsers do not need any prefixes.You do not need Autoprefixer anymore.
Check your Browserslist config to be sure that your targets are set up correctly.

  Learn more at:
  https://github.com/postcss/autoprefixer#readme
  https://github.com/browserslist/browserslist#readme

`));
    }
    Db.exports = tr;
    function tr(...r) {
      let e;
      if (
        (r.length === 1 && QO(r[0])
          ? ((e = r[0]), (r = void 0))
          : r.length === 0 || (r.length === 1 && !r[0])
          ? (r = void 0)
          : r.length <= 2 && (Array.isArray(r[0]) || !r[0])
          ? ((e = r[1]), (r = r[0]))
          : typeof r[r.length - 1] == 'object' && (e = r.pop()),
        e || (e = {}),
        e.browser)
      )
        throw new Error(
          'Change `browser` option to `overrideBrowserslist` in Autoprefixer'
        );
      if (e.browserslist)
        throw new Error(
          'Change `browserslist` option to `overrideBrowserslist` in Autoprefixer'
        );
      e.overrideBrowserslist
        ? (r = e.overrideBrowserslist)
        : e.browsers &&
          (typeof console != 'undefined' &&
            console.warn &&
            ($l.red
              ? console.warn(
                  $l.red(
                    Pb.replace(/`[^`]+`/g, (n) => $l.yellow(n.slice(1, -1)))
                  )
                )
              : console.warn(Pb)),
          (r = e.browsers));
      let t = {
        ignoreUnknownVersions: e.ignoreUnknownVersions,
        stats: e.stats,
        env: e.env,
      };
      function i(n) {
        let s = Tb,
          a = new WO(s.browsers, r, n, t),
          o = a.selected.join(', ') + JSON.stringify(e);
        return jl.has(o) || jl.set(o, new GO(s.prefixes, a, e)), jl.get(o);
      }
      return {
        postcssPlugin: 'autoprefixer',
        prepare(n) {
          let s = i({ from: n.opts.from, env: e.env });
          return {
            OnceExit(a) {
              JO(n, s),
                e.remove !== !1 && s.processor.remove(a, n),
                e.add !== !1 && s.processor.add(a, n);
            },
          };
        },
        info(n) {
          return (n = n || {}), (n.from = n.from || m.cwd()), YO(i(n));
        },
        options: e,
        browsers: r,
      };
    }
    tr.postcss = !0;
    tr.data = Tb;
    tr.defaults = VO.defaults;
    tr.info = () => tr().info();
  });
  var qb = {};
  Ce(qb, { default: () => XO });
  var XO,
    Rb = C(() => {
      l();
      XO = [];
    });
  var Fb = {};
  Ce(Fb, { default: () => KO });
  var Mb,
    KO,
    Nb = C(() => {
      l();
      ui();
      (Mb = K(hi())), (KO = Ke(Mb.default.theme));
    });
  var Bb = {};
  Ce(Bb, { default: () => ZO });
  var Lb,
    ZO,
    $b = C(() => {
      l();
      ui();
      (Lb = K(hi())), (ZO = Ke(Lb.default));
    });
  l();
  ('use strict');
  var eE = Qe(em()),
    tE = Qe(me()),
    rE = Qe(Ib()),
    iE = Qe((Rb(), qb)),
    nE = Qe((Nb(), Fb)),
    sE = Qe(($b(), Bb)),
    aE = Qe((Gn(), au)),
    oE = Qe((uo(), lo)),
    lE = Qe((os(), $u));
  function Qe(r) {
    return r && r.__esModule ? r : { default: r };
  }
  console.warn(
    'cdn.tailwindcss.com should not be used in production. To use Tailwind CSS in production, install it as a PostCSS plugin or use the Tailwind CLI: https://tailwindcss.com/docs/installation'
  );
  var $n = 'tailwind',
    zl = 'text/tailwindcss',
    jb = '/template.html',
    bt,
    zb = !0,
    Vb = 0,
    Vl = new Set(),
    Ul,
    Ub = '',
    Wb = (r = !1) => ({
      get(e, t) {
        return (!r || t === 'config') &&
          typeof e[t] == 'object' &&
          e[t] !== null
          ? new Proxy(e[t], Wb())
          : e[t];
      },
      set(e, t, i) {
        return (e[t] = i), (!r || t === 'config') && Wl(!0), !0;
      },
    });
  window[$n] = new Proxy(
    {
      config: {},
      defaultTheme: nE.default,
      defaultConfig: sE.default,
      colors: aE.default,
      plugin: oE.default,
      resolveConfig: lE.default,
    },
    Wb(!0)
  );
  function Gb(r) {
    Ul.observe(r, {
      attributes: !0,
      attributeFilter: ['type'],
      characterData: !0,
      subtree: !0,
      childList: !0,
    });
  }
  new MutationObserver(async (r) => {
    let e = !1;
    if (!Ul) {
      Ul = new MutationObserver(async () => await Wl(!0));
      for (let t of document.querySelectorAll(`style[type="${zl}"]`)) Gb(t);
    }
    for (let t of r)
      for (let i of t.addedNodes)
        i.nodeType === 1 &&
          i.tagName === 'STYLE' &&
          i.getAttribute('type') === zl &&
          (Gb(i), (e = !0));
    await Wl(e);
  }).observe(document.documentElement, {
    attributes: !0,
    attributeFilter: ['class'],
    childList: !0,
    subtree: !0,
  });
  async function Wl(r = !1) {
    r && (Vb++, Vl.clear());
    let e = '';
    for (let i of document.querySelectorAll(`style[type="${zl}"]`))
      e += i.textContent;
    let t = new Set();
    for (let i of document.querySelectorAll('[class]'))
      for (let n of i.classList) Vl.has(n) || t.add(n);
    if (
      document.body &&
      (zb || t.size > 0 || e !== Ub || !bt || !bt.isConnected)
    ) {
      for (let n of t) Vl.add(n);
      (zb = !1), (Ub = e), (self[jb] = Array.from(t).join(' '));
      let i = (0, tE.default)([
        (0, eE.default)({
          ...window[$n].config,
          _hash: Vb,
          content: [jb],
          plugins: [
            ...iE.default,
            ...(Array.isArray(window[$n].config.plugins)
              ? window[$n].config.plugins
              : []),
          ],
        }),
        (0, rE.default)({ remove: !1 }),
      ]).process(
        `@tailwind base;@tailwind components;@tailwind utilities;${e}`
      ).css;
      (!bt || !bt.isConnected) &&
        ((bt = document.createElement('style')), document.head.append(bt)),
        (bt.textContent = i);
    }
  }
})();
/*! https://mths.be/cssesc v3.0.0 by @mathias */
