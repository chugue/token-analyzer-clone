import { Telegraf } from "telegraf";
import {
  BroadcastChannelResult,
  BroadcastMessage,
  Broadcaster,
} from "../types/broadcasting.t";

export class TelegramBroadcaster implements Broadcaster {
  readonly name = "telegram";
  private bot?: Telegraf;

  constructor() {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (botToken && botToken !== "your_telegram_bot_token") {
      this.bot = new Telegraf(botToken);
      console.log("🤖 Telegram 봇 초기화 완료");
    } else {
      console.warn(
        "⚠️ TELEGRAM_BOT_TOKEN이 설정되지 않았습니다. Mock 모드로 동작합니다."
      );
    }
  }
  send(
    message: BroadcastMessage,
    channel: string
  ): Promise<BroadcastChannelResult> {
    throw new Error("Method not implemented.");
  }
  validate(channel: string): boolean {
    throw new Error("Method not implemented.");
  }
}
