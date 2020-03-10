import Poster from '../plugins/poster';
import Start from '../plugins/start';
import Enter from '../plugins/enter';
import PC from '../plugins/pc'
import Mobile from '../plugins/mobile'
import Keyboard from '../plugins/keyboard'
import Loading from '../plugins/loading'
import sniffer from '../utils/sniffer';

import PlayIcon from '../plugins/play'
import FullScreen from '../plugins/fullscreen'
import TimeIcon from '../plugins/time'
import Volume from '../plugins/volume'
import RotateIcon from '../plugins/rotate'
import PIPIcon from '../plugins/pip'
// import DownLoadIcon from '../plugins/download'
// import ScreenShotIcon from '../plugins/screenShot'
import DefinitionIcon from '../plugins/definition'
import PlaybackRateIcon from '../plugins/playbackRate'
import CssFullScreen from '../plugins/cssFullScreen'

export default class DefaultPreset {
  constructor () {
    const contolsIcons = [PlayIcon, FullScreen, TimeIcon, Volume,
      RotateIcon, DefinitionIcon, PlaybackRateIcon, CssFullScreen, PIPIcon]
    this.plugins = [Poster, Start, Loading, Enter, ...contolsIcons]

    switch (sniffer.device) {
      case 'pc':
        this.plugins.push(...[Keyboard, PC]);
        break;
      case 'mobile':
        this.plugins.push(Mobile);
        break;
      default:
        this.plugins.push(...[Keyboard, PC])
    }
    this.ignores = []
  }
}
