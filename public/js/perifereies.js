
var rsr = Raphael('map', '1049', '886');
rsr.setViewBox(0, 0, '1049', '886', true);
rsr.setSize('100%', '100%');

var periphereies_1 = rsr.set();
var periphereies_2 = rsr.set();
var periphereies_3 = rsr.set();
var periphereies_4 = rsr.set();
var periphereies_5 = rsr.set();
var periphereies_6 = rsr.set();
var periphereies_7 = rsr.set();
var periphereies_8 = rsr.set();
var periphereies_9 = rsr.set();
var periphereies_10 = rsr.set();
var periphereies_11 = rsr.set();
var periphereies_12 = rsr.set();
var periphereies_13 = rsr.set();

const regions = [periphereies_1, periphereies_2, periphereies_3, periphereies_4, periphereies_5, periphereies_6, periphereies_7, periphereies_8, periphereies_9, periphereies_10, periphereies_11, periphereies_12, periphereies_13];

let regionColors = generateColors(1, 0.4, regions.length);


axios.get('/paths.json').then((resp) => {
    console.log(resp)
    const ajaxPaths = resp.data;
    const paths = {}

    Object.keys(ajaxPaths).map(function (key, index) {
        paths[key] = rsr.path(ajaxPaths[key]);
    });


    periphereies_1.push(paths.b, paths.c, paths.d, paths.e, paths.f, paths.g, paths.h, paths.i, paths.j, paths.k, paths.l, paths.m);
    periphereies_2.push(paths.n, paths.o, paths.p, paths.q, paths.r, paths.s, paths.t, paths.u, paths.v, paths.w, paths.x, paths.y, paths.z, paths.aa, paths.ab, paths.ac, paths.ad, paths.ae, paths.af, paths.ag, paths.ah, paths.ai, paths.aj, paths.ak, paths.al, paths.am, paths.an, paths.ao, paths.ap, paths.aq, paths.ar, paths.as, paths.at, paths.au, paths.av, paths.aw, paths.ax, paths.ay, paths.az, paths.ba, paths.bb, paths.bc, paths.bd);
    periphereies_3.push(paths.be);
    periphereies_4.push(paths.bf, paths.bg, paths.bh, paths.bi, paths.bj, paths.bk, paths.bl, paths.bm, paths.bn, paths.bo, paths.bp, paths.bq, paths.br, paths.bs, paths.bt, paths.bu, paths.bv, paths.bw, paths.bx, paths.by, paths.bz, paths.ca, paths.cb, paths.cc, paths.cd, paths.ce, paths.cf, paths.cg, paths.ch, paths.ci, paths.cj, paths.ck, paths.cl, paths.cm, paths.cn, paths.co);
    periphereies_5.push(paths.cp, paths.cq, paths.cr, paths.cs, paths.ct, paths.cu, paths.cv, paths.cw, paths.cx, paths.cy, paths.cz, paths.da, paths.db, paths.dc, paths.dd, paths.de, paths.df, paths.dg, paths.dh, paths.di, paths.dj, paths.dk, paths.dl, paths.dm, paths.dn, paths.do, paths.dp, paths.dq, paths.dr, paths.ds, paths.dt, paths.du, paths.dv, paths.dw, paths.dx, paths.dy, paths.dz, paths.ea);
    periphereies_6.push(paths.eb, paths.ec, paths.ed, paths.ee, paths.ef, paths.eg, paths.eh, paths.ei, paths.ej, paths.ek, paths.el, paths.em, paths.en, paths.eo, paths.ep, paths.eq, paths.er, paths.es, paths.et, paths.eu, paths.ev, paths.ew, paths.ex, paths.ey, paths.ez, paths.fa, paths.fb, paths.fc, paths.fd, paths.fe, paths.ff, paths.fg, paths.fh, paths.fi, paths.fj, paths.fk, paths.fl, paths.fm, paths.fn, paths.fo, paths.fp, paths.fq, paths.fr, paths.fs, paths.ft, paths.fu, paths.fv, paths.fw, paths.fx, paths.fy, paths.fz, paths.ga, paths.gb, paths.gc, paths.gd, paths.ge, paths.gf, paths.gg, paths.gh, paths.gi, paths.gj, paths.gk, paths.gl, paths.gm, paths.gn, paths.go, paths.gp, paths.gq, paths.gr);
    periphereies_7.push(paths.gs, paths.gt, paths.gu, paths.gv, paths.gw, paths.gx, paths.gy, paths.gz, paths.ha, paths.hb, paths.hc, paths.hd, paths.he, paths.hf, paths.hg, paths.hh, paths.hi, paths.hj, paths.hk, paths.hl, paths.hm, paths.hn, paths.ho, paths.hp, paths.hq, paths.hr, paths.hs, paths.ht, paths.hu, paths.hv, paths.hw, paths.hx, paths.hy, paths.hz, paths.ia, paths.ib, paths.ic, paths.id, paths.ie, paths.if, paths.ig, paths.ih, paths.ii, paths.ij, paths.ik, paths.il, paths.im, paths.in, paths.io, paths.ip, paths.iq, paths.ir, paths.is, paths.it, paths.iu, paths.iv, paths.iw, paths.ix, paths.iy, paths.iz, paths.ja, paths.jb, paths.jc, paths.jd, paths.je, paths.jf, paths.jg, paths.jh, paths.ji, paths.jj, paths.jk, paths.jl, paths.jm, paths.jn, paths.jo, paths.jp, paths.jq, paths.jr, paths.js, paths.jt, paths.ju, paths.jv, paths.jw, paths.jx, paths.jy, paths.jz, paths.ka, paths.kb, paths.kc, paths.kd, paths.ke, paths.kf, paths.kg, paths.kh, paths.ki, paths.kj, paths.kk, paths.kl, paths.km, paths.kn, paths.ko, paths.kp, paths.kq, paths.kr, paths.ks, paths.kt, paths.ku, paths.kv, paths.kw, paths.kx, paths.ky, paths.kz, paths.la, paths.lb, paths.lc, paths.ld, paths.le, paths.lf, paths.lg, paths.lh, paths.li, paths.lj, paths.lk, paths.ll, paths.lm, paths.ln, paths.lo, paths.lp, paths.lq, paths.lr, paths.ls, paths.lt, paths.lu, paths.lv, paths.lw, paths.lx, paths.ly, paths.lz, paths.ma, paths.mb, paths.mc, paths.md, paths.me, paths.mf, paths.mg, paths.mh, paths.mi, paths.mj, paths.mk, paths.ml, paths.mm, paths.mn, paths.mo, paths.mp, paths.mq, paths.mr, paths.ms, paths.mt, paths.mu, paths.mv, paths.mw, paths.mx, paths.my, paths.mz, paths.na, paths.nb, paths.nc, paths.nd, paths.ne, paths.nf, paths.ng, paths.nh, paths.ni, paths.nj, paths.nk, paths.nl, paths.nm, paths.nn, paths.no, paths.np, paths.nq, paths.nr, paths.ns, paths.nt, paths.nu, paths.nv, paths.nw, paths.nx, paths.ny, paths.nz, paths.oa, paths.ob, paths.oc, paths.od, paths.oe, paths.of, paths.og, paths.oh, paths.oi, paths.oj, paths.ok, paths.ol, paths.om, paths.on, paths.oo, paths.op, paths.oq, paths.or, paths.os, paths.ot, paths.ou, paths.ov, paths.ow, paths.ox, paths.oy, paths.oz, paths.pa, paths.pb, paths.pc, paths.pd, paths.pe, paths.pf, paths.pg, paths.ph, paths.pi, paths.pj, paths.pk, paths.pl, paths.pm, paths.pn, paths.po, paths.pp, paths.pq, paths.pr, paths.ps, paths.pt, paths.pu, paths.pv, paths.pw, paths.px, paths.py, paths.pz, paths.qa, paths.qb, paths.qc, paths.qd, paths.qe, paths.qf, paths.qg, paths.qh, paths.qi, paths.qj, paths.qk, paths.ql, paths.qm, paths.qn, paths.qo, paths.qp, paths.qq, paths.qr, paths.qs, paths.qt, paths.qu, paths.qv, paths.qw, paths.qx, paths.qy, paths.qz, paths.ra, paths.rb, paths.rc, paths.rd, paths.re, paths.rf, paths.rg, paths.rh, paths.ri, paths.rj, paths.rk, paths.rl, paths.rm, paths.rn, paths.ro, paths.rp);
    periphereies_8.push(paths.rq, paths.rr, paths.rs, paths.rt, paths.ru, paths.rv, paths.rw, paths.rx, paths.ry, paths.rz, paths.sa, paths.sb, paths.sc, paths.sd, paths.se, paths.sf, paths.sg, paths.sh, paths.si, paths.sj, paths.sk, paths.sl, paths.sm, paths.sn, paths.so, paths.sp, paths.sq, paths.sr, paths.ss, paths.st, paths.su, paths.sv, paths.sw, paths.sx, paths.sy, paths.sz, paths.ta, paths.tb, paths.tc, paths.td, paths.te, paths.tf, paths.tg, paths.th, paths.ti, paths.tj, paths.tk, paths.tl, paths.tm, paths.tn, paths.to, paths.tp, paths.tq, paths.tr, paths.ts, paths.tt, paths.tu, paths.tv, paths.tw, paths.tx, paths.ty, paths.tz, paths.ua, paths.ub, paths.uc);
    periphereies_9.push(paths.ud, paths.ue, paths.uf, paths.ug, paths.uh, paths.ui, paths.uj, paths.uk, paths.ul, paths.um, paths.un, paths.uo, paths.up, paths.uq, paths.ur, paths.us, paths.ut, paths.uu, paths.uv, paths.uw, paths.ux, paths.uy, paths.uz, paths.va, paths.vb, paths.vc, paths.vd, paths.ve, paths.vf, paths.vg, paths.vh, paths.vi, paths.vj, paths.vk, paths.vl, paths.vm, paths.vn, paths.vo, paths.vp, paths.vq, paths.vr, paths.vs, paths.vt, paths.vu, paths.vv, paths.vw, paths.vx, paths.vy, paths.vz, paths.wa, paths.wb, paths.wc, paths.wd, paths.we, paths.wf, paths.wg, paths.wh, paths.wi, paths.wj, paths.wk, paths.wl, paths.wm, paths.wn, paths.wo, paths.wp, paths.wq, paths.wr, paths.ws, paths.wt, paths.wu, paths.wv, paths.ww, paths.wx, paths.wy, paths.wz);
    periphereies_10.push(paths.xa, paths.xb, paths.xc, paths.xd, paths.xe, paths.xf, paths.xg, paths.xh, paths.xi, paths.xj, paths.xk, paths.xl, paths.xm, paths.xn, paths.xo, paths.xp, paths.xq, paths.xr, paths.xs, paths.xt, paths.xu, paths.xv, paths.xw, paths.xx, paths.xy, paths.xz, paths.ya, paths.yb, paths.yc, paths.yd);
    periphereies_11.push(paths.ye, paths.yf, paths.yg, paths.yh, paths.yi, paths.yj, paths.yk, paths.yl, paths.ym, paths.yn, paths.yo, paths.yp, paths.yq, paths.yr, paths.ys, paths.yt, paths.yu, paths.yv, paths.yw, paths.yx, paths.yy, paths.yz, paths.za, paths.zb, paths.zc, paths.zd, paths.ze, paths.zf, paths.zg, paths.zh, paths.zi, paths.zj, paths.zk, paths.zl, paths.zm, paths.zn, paths.zo, paths.zp, paths.zq, paths.zr, paths.zs, paths.zt, paths.zu, paths.zv, paths.zw, paths.zx, paths.zy, paths.zz, paths.aaa, paths.aab, paths.aac, paths.aad, paths.aae, paths.aaf, paths.aag, paths.aah, paths.aai, paths.aaj, paths.aak, paths.aal, paths.aam, paths.aan, paths.aao, paths.aap, paths.aaq, paths.aar, paths.aas, paths.aat, paths.aau, paths.aav, paths.aaw);
    periphereies_12.push(paths.aax, paths.aay, paths.aaz, paths.aba, paths.abb, paths.abc, paths.abd, paths.abe, paths.abf, paths.abg, paths.abh, paths.abi, paths.abj, paths.abk, paths.abl, paths.abm, paths.abn, paths.abo, paths.abp, paths.abq, paths.abr, paths.abs, paths.abt, paths.abu, paths.abv, paths.abw, paths.abx, paths.aby, paths.abz, paths.aca, paths.acb, paths.acc, paths.acd, paths.ace, paths.acf, paths.acg, paths.ach, paths.aci, paths.acj, paths.ack, paths.acl, paths.acm, paths.acn, paths.aco, paths.acp, paths.acq, paths.acr);
    periphereies_13.push(paths.acs, paths.act, paths.acu, paths.acv, paths.acw, paths.acx, paths.acy, paths.acz, paths.ada, paths.adb, paths.adc, paths.add, paths.ade, paths.adf, paths.adg, paths.adh, paths.adi, paths.adj, paths.adk, paths.adl, paths.adm, paths.adn, paths.ado, paths.adp, paths.adq, paths.adr, paths.ads, paths.adt, paths.adu, paths.adv, paths.adw, paths.adx, paths.ady, paths.adz, paths.aea, paths.aeb, paths.aec, paths.aed, paths.aee, paths.aef, paths.aeg, paths.aeh, paths.aei, paths.aej, paths.aek, paths.ael, paths.aem, paths.aen, paths.aeo, paths.aep, paths.aeq, paths.aer, paths.aes, paths.aet, paths.aeu, paths.aev, paths.aew, paths.aex, paths.aey, paths.aez, paths.afa, paths.afb, paths.afc, paths.afd, paths.afe, paths.aff, paths.afg, paths.afh, paths.afi, paths.afj, paths.afk);


    for (var i = 0; i < regions.length; i++) {
        regions[i].attr('fill', regionColors[i]);
        regions[i].attr('stroke', 'rgb(255,255,255)')
        regions[i].attr('stroke-width', '1')
        regions[i].attr('stroke-opacity', '1')
        regions[i].attr('stroke-linejoin', 'round')
    }

    periphereies_1.hover(() => { periphereies_1.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_1.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_2.hover(() => { periphereies_2.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_2.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_3.hover(() => { periphereies_3.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_3.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_4.hover(() => { periphereies_4.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_4.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_5.hover(() => { periphereies_5.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_5.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_6.hover(() => { periphereies_6.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_6.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_7.hover(() => { periphereies_7.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_7.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_8.hover(() => { periphereies_8.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_8.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_9.hover(() => { periphereies_9.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_9.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_10.hover(() => { periphereies_10.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_10.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_11.hover(() => { periphereies_11.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_11.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_12.hover(() => { periphereies_12.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_12.attr('opacity', '1').attr('stroke-width', '1') });
    periphereies_13.hover(() => { periphereies_13.attr('opacity', '0.7').attr('stroke-width', '2') }, () => { periphereies_13.attr('opacity', '1').attr('stroke-width', '1') });

})






function generateColors(saturation, lightness, amount) {
    let rgbColors = [];
    let hslColors = generateHslaColors(saturation, lightness, amount);
    for (let countc = 0; countc < amount; countc++) {
        let currColorMap = hslToRgb(hslColors[countc].hue, hslColors[countc].saturation, hslColors[countc].lightness);
        rgbColors.push('rgb(' + currColorMap.red + ',' + currColorMap.green + ',' + currColorMap.blue + ')');
    }
    return rgbColors;
}

function generateHslaColors(saturation, lightness, amount) {
    let colors = []
    let huedelta = Math.trunc(360 / amount)

    for (let i = 0; i < amount; i++) {
        let hue = i * huedelta
        colors.push({ 'hue': hue, 'saturation': saturation, 'lightness': lightness });
    }

    return colors
}

function hslToRgb(h, s, l) {
    let a = s * Math.min(l, 1 - l);
    let f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return { 'red': f(0) * 255, 'green': f(8) * 255, 'blue': f(4) * 255 };
}
