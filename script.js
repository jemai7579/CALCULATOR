(function(){
      const display = document.getElementById('display');
      const historyEl = document.getElementById('history');
      const pad = document.getElementById('pad');

      let current = '';
      let previous = '';
      let operator = null;
      let lastPressedEquals = false;

      function updateScreen(){
        display.textContent = current === '' ? '0' : current;
        historyEl.textContent = previous + (operator ? ' ' + operator : '');
      }

      function clearAll(){ current=''; previous=''; operator=null; lastPressedEquals=false; updateScreen(); }

      function backspace(){
        if(lastPressedEquals){ clearAll(); return; }
        current = current.slice(0,-1);
        updateScreen();
      }

      function appendNumber(n){
        if(lastPressedEquals){ current = ''; lastPressedEquals=false; }
        if(n === '.' && current.includes('.')) return;
        if(n === '0' && current === '0') return;
        current = current + n;
        updateScreen();
      }

      function chooseOperator(op){
        if(current === '' && previous === '') return;
        if(current === '' && previous !== ''){ operator = op; updateScreen(); return; }
        if(previous === ''){
          previous = current; operator = op; current = ''; updateScreen(); return;
        }
        // compute previous operator
        compute();
        operator = op;
        updateScreen();
      }

      function compute(){
        if(!operator || previous === '') return;
        const a = parseFloat(previous);
        const b = parseFloat(current === '' ? previous : current);
        if(isNaN(a) || isNaN(b)) return;
        let res;
        switch(operator){
          case '+': res = a + b; break;
          case '-': res = a - b; break;
          case '*': res = a * b; break;
          case '/': res = b === 0 ? 'Error' : a / b; break;
          case '%': res = a * (b/100); break;
          default: return;
        }
        // limit float length
        if(typeof res === 'number'){
          res = parseFloat(res.toPrecision(12));
        }
        previous = String(res);
        current = '';
        lastPressedEquals = true;
        updateScreen();
      }

      function percent(){
        if(current === '' && previous === '') return;
        if(current === ''){
          current = String(parseFloat(previous) / 100);
        } else {
          current = String(parseFloat(current) / 100);
        }
        updateScreen();
      }

      pad.addEventListener('click', e=>{
        const t = e.target;
        if(t.tagName !== 'BUTTON') return;
        if(t.dataset.number !== undefined){ appendNumber(t.dataset.number); return; }
        const action = t.dataset.action;
        switch(action){
          case 'clear': clearAll(); break;
          case 'back': backspace(); break;
          case 'percent': percent(); break;
          case 'divide': chooseOperator('/'); break;
          case 'multiply': chooseOperator('*'); break;
          case 'subtract': chooseOperator('-'); break;
          case 'add': chooseOperator('+'); break;
          case 'equals': compute(); break;
        }
      });

      // keyboard support
      window.addEventListener('keydown', e=>{
        if(e.key >= '0' && e.key <= '9'){ appendNumber(e.key); return; }
        if(e.key === '.' || e.key === ','){ appendNumber('.'); return; }
        if(e.key === 'Backspace'){ backspace(); return; }
        if(e.key === 'Escape'){ clearAll(); return; }
        if(e.key === 'Enter' || e.key === '='){ compute(); return; }
        if(e.key === '+'){ chooseOperator('+'); return; }
        if(e.key === '-') { chooseOperator('-'); return; }
        if(e.key === '*' || e.key === 'x' || e.key === 'X'){ chooseOperator('*'); return; }
        if(e.key === '/' || e.key === '÷'){ chooseOperator('/'); return; }
        if(e.key === '%'){ percent(); return; }
      });

      // initial
      clearAll();

    })();