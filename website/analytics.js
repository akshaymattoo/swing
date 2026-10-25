/* Swing website analytics: anonymous, cookieless, and intentionally limited. */
(function initializeSwingAnalytics(document, window) {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;

  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split('.');2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement('script')).type='text/javascript',p.crossOrigin='anonymous',p.async=!0,p.src=s.api_host.replace('.i.posthog.com','-assets.i.posthog.com')+'/static/array.js',p.onerror=function(){p=null},(r=t.getElementsByTagName('script')[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a='posthog',u.people=u.people||[],Object.defineProperty(u,'toString',{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e='posthog';return'posthog'!==a&&(e+='.'+a),t||(e+=' (stub)'),e}}),Object.defineProperty(u.people,'toString',{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+'.people (stub)'}}),o='init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug'.split(' '),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  window.posthog.init('phc_zixRHMDPa2JzxqNz52g8rMDz3NeuDMiWTnybMbGBbEu3', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-08-30',
    cookieless_mode: 'always',
    person_profiles: 'never',
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    capture_exceptions: false,
    disable_session_recording: true
  });

  document.addEventListener('click', function captureNamedAction(event) {
    var target = event.target.closest('[data-analytics-event]');
    if (!target) return;

    window.posthog.capture(target.dataset.analyticsEvent, {
      action: target.dataset.analyticsAction || 'open',
      destination: target.dataset.analyticsDestination || null,
      page: window.location.pathname
    });
  });

  document.querySelectorAll('[data-app-store-cta]').forEach(function configureAppStoreCta(cta) {
    if (cta.dataset.appStoreLive === 'true') {
      cta.href = cta.dataset.appStoreUrl;
      cta.textContent = 'Download on the App Store';
      cta.classList.remove('is-disabled');
      cta.removeAttribute('aria-disabled');
      cta.dataset.analyticsEvent = 'app_store_download_clicked';
      cta.dataset.analyticsAction = 'download';
      cta.dataset.analyticsDestination = 'app_store';
    }
  });
})(document, window);
