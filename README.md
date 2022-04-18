# mam-country-flags
MaM userscript adding imageboard-like country flags next to user links

![image](https://user-images.githubusercontent.com/19153947/163749054-89d0cadd-c005-49f8-b26e-232dcd5405dd.png)
![image](https://user-images.githubusercontent.com/19153947/163749161-8866c1a1-ce3e-4bd2-b491-fcdf9ad9474f.png)

The configuration is done by editing the script, here is what options are available:
```javascript
/************************/
/* CONFIG */
/**/
/**/ /* How often should the script check for new flags in milliseconds (for example messages in shoutbox) (default: 2000) */
/**/ var flagUpdateTime = 2000;
/**/
/**/ /* Size of the flags, applied only with non-chan flags (default: 16) */
/**/ var flagWidth = 16;
/**/
/**/ /* 4chan style flags (instead of MaM flag svg's, 4chan flag images are used) (default: false) */
/**/ var chan_style = false;
/**/
/**/ /* Show on hover, hide otherwise (default: false) */
/**/ var show_on_hover = false;
/**/
/**/ /* Show while holding specified key, hide otherwise (default: false) */
/**/ var show_on_key = false;
/**/
/**/ /* Key code to show flags (find them here: https://keycode.info/for/control) (default: 17 (the left control key)) */
/**/ var show_key_code = 17;
/**/
/**/ /* Enable in shoutbox (default: true) */
/**/ var enable_shoutbox = true;
/**/
/**/ /* Image url for unknown flag (default: 'https://cdn.myanonamouse.net/imagebucket/185207/unknown_flag_16.png') */
/**/ var unknown_flag_url = 'https://cdn.myanonamouse.net/imagebucket/185207/xx.gif';
/**/
/************************/
```
