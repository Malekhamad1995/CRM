import { config } from '../config/config';

export const FreshdeskHelper = () => {
  const ScriptConteaner = document.createElement('script');
  ScriptConteaner.setAttribute('src', config.freshdesk_ws_address);
  ScriptConteaner.setAttribute('type', 'text/javascript');
  ScriptConteaner.setAttribute('id', 'main');
  document.body.appendChild(ScriptConteaner);
  const ScriptConteanerWebsite = document.createElement('script');
  const functionWebsite = config.functionWebsite_freshdesk_ws;
  ScriptConteanerWebsite.innerHTML = functionWebsite;
  ScriptConteanerWebsite.setAttribute('id', 'windowfwSettings');
  document.body.appendChild(ScriptConteanerWebsite);
};
export const FreshdeskHelperRemve = () => {
  const script = document.getElementById('main');
  if (script !== null)
    script.remove();
  const scriptwindowfwSettings = document.getElementById('windowfwSettings');
  if (scriptwindowfwSettings !== null)
    scriptwindowfwSettings.remove();
  const script2 = document.getElementById('freshworks-container');
  if (script2 !== null)
    script2.remove();
  const script3 = document.getElementById('freshworks-frame');
  if (script3 !== null)
    script3.remove();
  const script4 = document.getElementById('freshworks-frame');
  if (script4 !== null)
    script4.remove();
};
