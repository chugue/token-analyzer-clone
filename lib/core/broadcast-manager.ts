import { TelegramBroadcaster } from "../broadcasting/telegram-broadcaster";
import {
  BroadcastChannelResult,
  BroadcastMessage,
  BroadcastRequest,
  BroadcastResult,
  Broadcaster,
} from "../types/broadcastring";

export class BroadcastManager {
  private broadcasters: Map<string, Broadcaster> = new Map();

  constructor() {
    this.initializeDefaultBroadcasters();
  }

  async broadcast(request: BroadcastRequest): Promise<BroadcastResult> {
    if (!request.enabled) {
      console.log(`🔔 브로드캐스팅 비활성화됨`);
      return { success: true, channels: [] };
    }

    if (!request.message) {
      console.warn("⚠️ 브로드캐스팅 메시지가 없음");
      return {
        success: false,
        channels: [],
        error: "Broadcast message is required",
      };
    }

    console.log(`📡 브로드캐스팅 시작: ${request.channels.length}개 채널`);

    try {
      const channelResults = await Promise.all(
        request.channels.map((channel) =>
          this.sendToChannel(request.message!, channel)
        )
      );

      const failed = channelResults.filter((result) => !result.success);

      if (failed.length > 0) {
        const message = failed
          .map((fail) => `${fail.channel}: ${fail.error ?? "unknown error"}`)
          .join(", ");
        throw new Error(
          `Broadcast failed for ${failed.length} channels: ${message}`
        );
      }

      console.log(`📡 브로드캐스팅 완료:`, {
        success: true,
        channels: channelResults.length,
      });

      return {
        success: true,
        channels: channelResults,
      };
    } catch (error) {
      console.error("❌ 브로드캐스팅 오류:", (error as Error).message);
      throw error;
    }
  }

  private async sendToChannel(
    message: BroadcastMessage,
    channel: string
  ): Promise<BroadcastChannelResult> {
    try {
      const broadcasterType = this.extractBroadcasterType(channel);
      const broadcaster = this.broadcasters.get(broadcasterType);
      if (!broadcaster) {
        throw new Error(`Broadcaster '${broadcasterType}' not found`);
      }

      if (!broadcaster?.validate(channel)) {
        throw new Error(`Invalid channel format: ${channel}`);
      }

      const result = await broadcaster.send(message, channel);

      return result;
    } catch (error) {
      console.error(
        `❌ 채널 브로드캐스트 오류: ${channel}`,
        (error as Error).message
      );
      throw error;
    }
  }
  private extractBroadcasterType(channel: string): string {
    const colonIndex = channel.indexOf(":");
    if (colonIndex === -1) {
      return "telegram";
    }
  }

  private initializeDefaultBroadcasters() {
    const telegramBroadcaster = new TelegramBroadcaster();
  }
}
