export default class ScriptProc {
  constructor(data, columns) {
    this.data = data;
    this.columns = columns;
  }
  execute(ogs, flag, column) {
    return this.executea(ogs, flag, column);
  }
  executea(ogs, flag, column) {
    if (!ogs)
      return null;
    var s0 = ogs;
    var c0 = s0.charAt(0);
    if (c0 === '~') {
      s0 = s0.substring(1); //;--滤掉上一行的标志
      c0 = s0.charAt(0);
    }
    var xlf = s0.indexOf('\n');
    if (c0 === '<' && s0.charAt(1) === '@') {
      // TODO 上一行运算
    } else if (xlf > 0) {
      // TODO 后续处理
    } else {
      s0 = this.expcalc(s0, true);
      // console.log(s0);
      return this.keepRound(s0, column); //;--单行公式
    }
  }

  expcalc(s0, istrue) {
    if (typeof (s0) == 'string') {
      s0 = this.bdstovec(s0);
    }
    if (typeof (s0) == 'object') {
      var bb = [];
      return this.expcalc1(s0, bb, 0, s0.length);
    }
    // console.log(s0);
    // console.log(typeof (s0));
    return s0;
  }

  expcalc1(vgs, bufs, x0, x1) {
    var ov, dvs = vgs,sv0,sv1;
    var cfhs = ['+', '+', '+', '+'],
      cfh, c0, c1;
    var idx = 0,
      cx0 = 0,
      t1 = 0;
    var bfh = false,
      b0 = false;
    for (var i = x0; i < x1; i++) {
      if (bfh) {
        var cfh = dvs[i].charCodeAt(0);
        c1 = (cfh >>> 8);
        c0 = (cfh & 0xff);
        if (c0 == c1) {
          if (c0 == '|' || c0 == '&') {
            for (idx--; idx >= 0; idx--)
              bufs[idx] = this.calcTwoItem(bufs[idx], bufs[idx + 1], cfhs[idx]);
            b0 = new Boolean(bufs[0]);
            if ((b0 && c0 == '|') || (c0 == '&' && !b0))
              return bufs[0];
            idx = 0;
          } else if (c0 == '+' || c0 == '-') {
            varIncDes(bufs[idx], c0);
            bfh = false;
          } else {
            cfhs[idx++] = cfh;
          }
        } else {
          cfhs[idx++] = cfh;
        }
      } else {
        ov = dvs[i];
        if (typeof (ov) == 'string') {
          sv0 = ov;
          cfh = sv0.charAt(0);
          if (cfh == '(' || cfh == '[') {
            t1 = sv0.length;
            cx0 = this.nextBarcket4(sv0.split(''), 0, t1, cfh);
            t1--;
            if (cx0 >= t1 || cx0 < 1) {
              sv0 = sv0.substring(1, t1); // [xxxx]
              // console.log(sv0);
              sv1 = null;
            } else {
              sv1 = sv0.substring(cx0 + 2); //[xxxx].方法或其它变量
              sv0 = sv0.substring(1, cx0);
              // console.log(sv0);
            }
            ov = cfh == '(' ? this.expcalc(sv0, true) : this.invokeref(sv0);
            if (ov != null && sv1 != null) {
              // 有其他关联
            }
            bufs[idx] = ov;
          } else {
            bufs[idx] = this.expItem(sv0, true);
          }
        } else {
          bufs[idx] = ov;
        }
        if (idx > 1)
          idx = this.calcItems(bufs, cfhs, idx);
      }
      bfh = !bfh;
    }
    if (!bfh)
      idx--;
    for (var i = idx - 1; i >= 0; i--)
      bufs[i] = this.calcTwoItem(bufs[i], bufs[i + 1], cfhs[i]);
    ov = bufs[0];
    return ov;
  }

  expItem(s0, bds) {
    var x1 = s0 != null ? s0.length - 1 : -1;
    if (x1 < 0)
      return null;
    if ("null" == (s0))
      return null;
    var b0 = s0 == ("true");
    if (b0 || "false" == (s0))
      return new Boolean(b0);
    var c0 = s0.charAt(0);
    var bfh = c0 == '-';
    if (bfh || (c0 >= '0' && c0 <= '9')) {
      return new Number(s0);
    }
    return s0;
  }

  calcTwoItem(o0, o1, cfh) {
    // console.log('calcTwoItem');
    var c0 = String.fromCharCode(cfh & 0xFF),
      c1 = String.fromCharCode(cfh >>> 8);
    if (c1 == '=' || c0 == '<' || c0 == '>') {
      // 逻辑比较值
      return true;
    }
    return this.calcTwoValue(o0, o1, c0);
  }

  //最终的两个数值运算，可以直接在接口中调用。 
  calcTwoValue(o0, o1, ysf) {
    if (ysf == '+' || ysf == '|') {
      if (o0 == null)
        return o1;
      if (o1 == null)
        return o0;
      if (ysf == '+' && typeof (o0) != 'date' && (typeof (o0) != 'number' || typeof (o1) != 'number'))
        return o0 + '' + o1;
    }
    return this.calcTwoObject(o0, o1, ysf, 0);
  }

  calcTwoObject(o0, o1, ysf, cpnt) {
    return this.calcTwoNumber(o0, o1, ysf, cpnt);
  };

  // 两个数值做运算
  calcTwoNumber(o0, o1, cfh, cpnt) {
    if (cfh == '+' || cfh == '-' || cfh == '*' || cfh == '/') {
      if (cfh == '+') {
        var a = new Number(o0) + (new Number(o1));
        return a;
      }
      if (cfh == '-') {
        var a = new Number(o0) - (new Number(o1));
        return a;
      }
      if (cfh == '*') {
        var a = new Number(o0) * (new Number(o1));
        return a;
      }
      if (cfh == '/') {
        var a = new Number(o0) / (new Number(o1));
        return a;
      }
    }
  }

  calcItems(ovs, fhs, idx) {
    var x0 = idx - 2,
      x1 = idx - 1,
      c0 = this.tolevel(fhs[x0]);
    if (c0 < 1 || c0 < this.tolevel(fhs[x1]))
      return idx; //注意赋值语句
    // console.log('calcItems');
    ovs[x0] = this.calcTwoItem(ovs[x0], ovs[x1], fhs[x0]);
    ovs[x1] = ovs[idx];
    fhs[x0] = fhs[x1];
    idx--;
    if (idx > 1)
      idx = this.calcItems(ovs, fhs, idx);
    return idx;
  }

  tolevel(c01) {
    var c0 = (c01 & 0xff);
    c0 = String.fromCharCode(c0);
    if (c01 == '=')
      return 0; //不支持等号与运算符连用,如"+=","*="等，用"A=A+..."表示
    if (c0 == '&' || c0 == '|' || c0 == '^')
      return 1;
    if (c0 == '>' || c0 == '<')
      return 2;
    if (c0 == '+' || c0 == '-')
      return 3;
    if (c0 == '*' || c0 == '/' || c0 == '%')
      return 4;
  }

  invokeref(s0) {
    var c0 = s0.charAt(0);
    if (c0 == '&') {
      // 暂时不处理
    }
    var cx = 0,
      t0 = 0;
    var ov = null,
      ors = {};
    var b0 = c0 == '^' || c0 == '<';
    if (b0) {
      // 取父节点数据或者上一行数据
    } else if (c0 >= 'a' && c0 <= 'z') {
      // 当前数据
      ov = this.data[s0];
    } else {
      ov = s0;
    }
    return ov;
  };

  varIncDes() {
    console.log('varIncDes');
  }

  bdstovec(s0) {
    var t0 = s0 ? s0.length : 0;
    if (t0 < 1)
      return [];
    var cs0 = s0.split(''),
      c0 = '0';
    var sFH = "=<>+-*/&|!^%",
      sDIV = sFH + ",;(['\'";
    var x0 = 0;
    var c1;
    for (x0 = 0; x0 < t0; x0++) {
      c0 = cs0[x0];
      if (sDIV.indexOf(c0) >= 0)
        break;
    }
    if (x0 >= t0)
      return s0; //非表达式
    var vgs = new Array();
    var buf = '',
      b0 = false;
    x0 = 0;
    var t1 = t0 - 1;
    for (; x0 < t0; x0++) {
      for (; x0 < t0 && cs0[x0] <= ' '; x0++);
      if (x0 >= t0)
        break;
      b0 = false;
      for (; x0 < t0; x0++) {
        c0 = cs0[x0];
        if (c0 <= ' ')
          break;
        if (c0 == '"' || c0 == '\'') {
          var retn = this.nextQuote(buf, cs0, x0, t0, c0);
          x0 = retn[0];
          buf = retn[1];
        } else if (c0 == '(' || c0 == '[') {
          var retn = this.nextBarcket(buf, cs0, x0, t0, c0);
          x0 = retn[0];
          buf = retn[1];
        } else {
          if (c0 == '\\') {
            x0++;
            if (x0 < t0) {
              buf += (c0); //;--转义符保留。
              c0 = cs0[x0];
            }
          } else {
            b0 = c0 == ',' || c0 == ';';
            if (!b0) {
              b0 = c0 == '-' ? buf.length > 0 : sFH.indexOf(c0) >= 0; //;-处理负数
              if (b0 && x0 < t1) {
                c1 = cs0[x0 + 1];
                if (sFH.indexOf(c1) > -1) {
                  c0 = ((c1 << 8) | c0); //;--复合运算符
                  x0++;
                }
              }
            }
            if (b0)
              break;
          }
          buf += (c0);
        }
      }
      if (buf.length > 0) {
        s0 = buf;
        if ("new" == s0)
          buf += (' ');
        else {
          vgs.push(s0);
          buf = '';
        }
      }
      if (b0)
        vgs.push(c0);
    }
    return vgs;
  }

  nextQuote(buf, cs0, x0, x1, ch) {
    buf += ch;
    for (x0++; x0 < x1; x0++) {
      var c0 = cs0[x0];
      if (c0 == ch) {
        buf += ch;
        return [x0, buf];
      }
      if (c0 == '\\') {
        x0++;
        if (x0 < x1) {
          c0 = cs0[x0];
          if (c0 == 'n')
            c0 = '\n';
          else if (c0 == 't')
            c0 = '\t';
          else if (c0 == 'r')
            c0 = '\r';
        }
      }
      buf += c0;
    }
    return [x1, buf];
  }

  nextBarcket(buf, cs0, x0, x1, chL) {
    var c0, chR = chL == '(' ? ')' : (chL == '[' ? ']' : '}');
    buf += (chL);
    x0++;
    for (var ct = 0; x0 < x1; x0++) {
      c0 = cs0[x0];
      if (c0 == chR) {
        buf += (c0);
        if (ct < 1)
          return [x0, buf];
        ct--;
      } else if (c0 == '\'' || c0 == '"') {
        var retn = this.nextQuote(buf, cs0, x0, x1, c0);
        x0 = retn[0]; //;-括号中的不算。
        buf = retn[1];
      } else {
        buf += (c0);
        if (c0 == chL)
          ct++;
        else if (c0 == '\\') {
          x0++;
          if (x0 < x1)
            buf += cs0[x0];
        }
      }
    }
    // console.log(buf);
    return [x1, buf];
  }

  nextBarcket4(cs0, x0, x1, chL) {
    var chR = chL == '[' ? ']' : chL == '(' ? ')' : '}';
    var ct = 0;
    for (x0++; x0 < x1; x0++) {
      var c0 = cs0[x0];
      if (c0 == chR) {
        if (ct < 1)
          return x0;
        ct--;
      } else if (c0 == chL) {
        ct++;
      } else if (c0 == '\\') {
        x0++;
      } else if ((c0 == '\'') || (c0 == '"')) {
        x0 = this.nextQuote4(cs0, x0, x1, c0);
      }
    }
    return x1;
  }

  nextQuote4(cs0, x0, x1, ch) {
    for (x0++; x0 < x1; x0++) {
      var c0 = cs0[x0];
      if (c0 == ch)
        return x0;
      if (c0 == '\\')
        x0++;
    }
    return x1;
  }

  // 四舍五入计算，按照列的小数位数，如果是numeric则进行计算，
  // 其他直接返回原值
  keepRound = function (v0, column) {
    if(column.dataType == 'numeric'){
      v0 = new Number(v0).toFixed(column.ccPoint);
    }
    if(isNaN(v0)) v0='';
    v0+='';

    this.data[column.field] = v0;
    // console.log(v0);
    // console.log(column.ccPoint,column);
    return v0;
  }
  // 获取列信息
  getColumn(columnName) {
    return this.columns.find(column => column.field === columnName);
  }
}