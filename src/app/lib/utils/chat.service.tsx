import _ from 'lodash';

import { ENABLE_CHAT } from '../../../_configuration';

if (ENABLE_CHAT) {
  window.addEventListener('chatwoot:ready', () => {
    ChatWoot.ready();
  });
}

class ChatWoot {
  static _ready: Boolean = false;
  static _onReady: Array<Function> = [];

  static ready() {
    if (!ChatWoot._ready) {
      ChatWoot._ready = true;
      _.each(ChatWoot._onReady, (callback: Function) => callback());
      ChatWoot._onReady = [];
    }
  }

  static _whenReady(callback: Function) {
    if (ChatWoot._ready) {
      callback();
    } else {
      ChatWoot._onReady.push(callback);
    }
  }

  static setUser(_id: string, info: any) {
    ChatWoot._whenReady(() => {
      const userInfo = _.pick(info, ['email', 'name']);
      const customInfo = _.omit(info, ['email', 'name']);

      // @ts-ignore
      window.$chatwoot.setUser(_id, userInfo);
      if (_.keys(customInfo).length) {
        // @ts-ignore
        window.$chatwoot.setCustomAttributes(customInfo);
      }
    });
  }

  static clearUser() {
    ChatWoot._whenReady(() => {
      // @ts-ignore
      window.$chatwoot.reset();
    });
  }

  static toggle() {
    ChatWoot._whenReady(() => {
      // @ts-ignore
      window.$chatwoot.toggle();
    })
  }
}

ChatWoot.toggle = ChatWoot.toggle.bind(ChatWoot);

export default ChatWoot;
