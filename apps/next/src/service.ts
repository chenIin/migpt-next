import {
  type MIoT,
  type MiNA,
  type MiServiceConfig as _MiServiceConfig,
  getMIoT,
  getMiNA,
} from '@mi-gpt/miot';
import { jsonEncode } from '@mi-gpt/utils/parse';
import { assert } from './utils.js';

export type MiServiceConfig = _MiServiceConfig;

class _MiService {
  MiNA?: MiNA;
  MiOT?: MIoT;

  async init(config: { debug: boolean; speaker: MiServiceConfig }) {
    const { debug = false, speaker } = config;

    assert(!!speaker.userId && !!speaker.password && !!speaker.did, '❌ Speaker 缺少必要参数');

    speaker.debug = debug;
    speaker.timeout = Math.max(1000, speaker.timeout ?? 5000);

    this.MiNA = await getMiNA(speaker);
    this.MiOT = await getMIoT(speaker);

    assert(
      !!this.MiNA && !!this.MiOT,
      '❌ 初始化 Mi Services 失败\n💡 提示：打开 debug 选项可获取设备真实 did',
    );

    if (debug) {
      const device: any = this.MiOT!.account?.device;
      console.debug(
        '🐛 设备信息：',
        jsonEncode(
          {
            name: device?.name,
            desc: device?.desc,
            model: device?.model,
            rom: device?.extra?.fw_version,
          },
          { prettier: true },
        ),
      );
    }
  }
}

export const MiService = new _MiService();
