import { I2IImageModule } from "@/lib/modules/i2i-image/i2i-image-module copy";
import { I2IImageService } from "@/lib/modules/i2i-image/i2i-image-service copy";
import { GeneratedImage } from "@/lib/types/i2i-image.t";

// I2IImageService 모킹
jest.mock("@/lib/modules/i2i-image/i2i-image-service copy");

describe("I2IImageModule", () => {
  let i2iModule: I2IImageModule;
  let mockI2IService: jest.Mocked<I2IImageService>;

  beforeEach(() => {
    jest.clearAllMocks();
    i2iModule = new I2IImageModule();
    mockI2IService = i2iModule["i2iService"] as jest.Mocked<I2IImageService>;
  });

  describe("execute", () => {
    const mockImage: GeneratedImage = {
      buffer: Buffer.from("test-image-data"),
      mimeType: "image/png",
      baseName: "test.png",
      sourcePath: "/i2i/base/test.png",
    };

    it("성공적으로 이미지를 생성하고 올바른 결과를 반환해야 함", async () => {
      // Arrange
      const params = { symbol: "BTC", locale: "ko" as const };
      mockI2IService.generateSymbolI2I = jest.fn().mockResolvedValue(mockImage);

      // Act
      const result = await i2iModule.execute(params);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.type).toBe("i2i-image");
      expect(result.data?.content).toEqual(mockImage);
      expect(result.data?.timestamp).toBeDefined();
      expect(result.metadata.executionTime).toBeGreaterThanOrEqual(0);
      expect(result.metadata.dataSource).toBe("Gemini I2I");
      expect(mockI2IService.generateSymbolI2I).toHaveBeenCalledWith(
        "BTC",
        "ko"
      );
    });

    it("locale이 없을 때 기본값 'ko'를 사용해야 함", async () => {
      // Arrange
      const params = { symbol: "ETH" };
      mockI2IService.generateSymbolI2I = jest.fn().mockResolvedValue(mockImage);

      // Act
      await i2iModule.execute(params);

      // Assert
      expect(mockI2IService.generateSymbolI2I).toHaveBeenCalledWith(
        "ETH",
        "ko"
      );
    });

    it("locale이 'en'일 때 영어 로케일을 사용해야 함", async () => {
      // Arrange
      const params = { symbol: "SOL", locale: "en" as const };
      mockI2IService.generateSymbolI2I = jest.fn().mockResolvedValue(mockImage);

      // Act
      await i2iModule.execute(params);

      // Assert
      expect(mockI2IService.generateSymbolI2I).toHaveBeenCalledWith(
        "SOL",
        "en"
      );
    });

    it("이미지가 null일 때 에러를 던져야 함", async () => {
      // Arrange
      const params = { symbol: "INVALID" };
      mockI2IService.generateSymbolI2I = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(i2iModule.execute(params)).rejects.toThrow(
        "Failed to generate image for INVALID"
      );
      expect(mockI2IService.generateSymbolI2I).toHaveBeenCalledWith(
        "INVALID",
        "ko"
      );
    });

    it("서비스에서 에러가 발생하면 에러를 던져야 함", async () => {
      // Arrange
      const params = { symbol: "ERROR" };
      const serviceError = new Error("Service error");
      mockI2IService.generateSymbolI2I = jest
        .fn()
        .mockRejectedValue(serviceError);

      // Act & Assert
      await expect(i2iModule.execute(params)).rejects.toThrow(
        "Failed to generate image for ERROR"
      );
    });

    it("실행 시간을 정확히 측정해야 함", async () => {
      // Arrange
      const params = { symbol: "BTC" };
      mockI2IService.generateSymbolI2I = jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) => setTimeout(() => resolve(mockImage), 100))
        );

      // Act
      const start = Date.now();
      const result = await i2iModule.execute(params);
      const end = Date.now();

      // Assert
      const actualTime = end - start;
      expect(result.metadata.executionTime).toBeGreaterThanOrEqual(0);
      expect(result.metadata.executionTime).toBeLessThanOrEqual(
        actualTime + 10
      ); // 10ms 여유
    });

    it("콘솔 로그가 올바르게 출력되어야 함", async () => {
      // Arrange
      const params = { symbol: "TEST" };
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      mockI2IService.generateSymbolI2I = jest.fn().mockResolvedValue(mockImage);

      // Act
      await i2iModule.execute(params);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[I2IImageModule] TEST 이미지 생성 시작")
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[I2IImageModule] TEST 이미지 생성 완료")
      );

      consoleSpy.mockRestore();
    });

    it("에러 발생 시 콘솔에 에러를 로그해야 함", async () => {
      // Arrange
      const params = { symbol: "ERROR" };
      const serviceError = new Error("Service error");
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      mockI2IService.generateSymbolI2I = jest
        .fn()
        .mockRejectedValue(serviceError);

      // Act & Assert
      await expect(i2iModule.execute(params)).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(serviceError);

      consoleSpy.mockRestore();
    });
  });
});
