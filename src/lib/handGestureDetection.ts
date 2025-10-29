import {
  GestureRecognizer,
  GestureRecognizerOptions,
  GestureRecognizerResult,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

/**
 * Hand Gesture Detection Utility
 * Detects hand gestures and counts extended fingers
 */
class HandGestureDetection {
  private gestureRecognizer: GestureRecognizer | null = null;
  private isInitialized = false;
  private lastLogTime = 0;
  private logInterval = 1000; // Log every 1 second to avoid spam

  /**
   * Initialize the MediaPipe Gesture Recognizer
   */
  async initialize(): Promise<boolean> {
    // If already initialized, cleanup first and reinitialize
    if (this.isInitialized) {
      console.log(
        "⚠️ Gesture detector already initialized, cleaning up first..."
      );
      this.cleanup();
    }

    try {
      console.log("🔄 Initializing hand gesture detector...");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm"
      );
      console.log("✅ MediaPipe vision tasks loaded");

      const config: GestureRecognizerOptions = {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task",
          delegate: "GPU",
        },
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        runningMode: "VIDEO",
      };

      this.gestureRecognizer = await GestureRecognizer.createFromOptions(
        vision,
        config
      );

      this.isInitialized = true;
      this.lastLogTime = 0; // Reset log time
      console.log("✅ Hand gesture detector initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Error initializing hand gesture detection:", error);
      this.isInitialized = false;
      this.gestureRecognizer = null;
      return false;
    }
  }

  /**
   * Detect gestures in a video frame
   */
  detectGesture(video: HTMLVideoElement): GestureRecognizerResult | null {
    if (!this.gestureRecognizer || !this.isInitialized) {
      console.warn("⚠️ Gesture recognizer not initialized");
      return null;
    }

    // Validate video element is ready and has valid dimensions
    if (!video || video.readyState < 2) {
      console.warn("⚠️ Video not ready, readyState:", video?.readyState);
      return null;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn(
        "⚠️ Video has invalid dimensions:",
        video.videoWidth,
        "x",
        video.videoHeight
      );
      return null;
    }

    try {
      const result = this.gestureRecognizer.recognizeForVideo(
        video,
        performance.now()
      );

      // Log detection results (throttled to avoid spam)
      const now = Date.now();
      if (
        result.landmarks &&
        result.landmarks.length > 0 &&
        now - this.lastLogTime > this.logInterval
      ) {
        console.log(
          "👋 Hand detected with",
          result.landmarks[0].length,
          "landmarks"
        );
        this.lastLogTime = now;
      }

      return result;
    } catch (error) {
      console.error("❌ Error detecting gesture:", error);
      return null;
    }
  }

  /**
   * Detect which specific fingers are extended
   * Returns an object with boolean flags for each finger
   */
  detectExtendedFingers(result: GestureRecognizerResult | null): {
    thumb: boolean;
    index: boolean;
    middle: boolean;
    ring: boolean;
    pinky: boolean;
  } | null {
    if (!result || !result.landmarks || result.landmarks.length === 0) {
      return null;
    }

    const landmarks = result.landmarks[0];
    const handedness = result.handednesses?.[0]?.[0];
    const isRightHand = handedness?.categoryName === "Right";

    // MediaPipe hand landmark indices:
    // 0: Wrist, 1-4: Thumb, 5-8: Index, 9-12: Middle, 13-16: Ring, 17-20: Pinky

    // Check thumb - enhanced detection with stricter criteria
    const thumbTip = landmarks[4];
    const thumbIp = landmarks[3];
    const thumbMcp = landmarks[2];
    const indexMcp = landmarks[5];
    const wrist = landmarks[0];

    // Distance check: thumb tip should be farther from index MCP than IP joint
    const thumbTipToIndexDist = Math.hypot(
      thumbTip.x - indexMcp.x,
      thumbTip.y - indexMcp.y
    );
    const thumbIpToIndexDist = Math.hypot(
      thumbIp.x - indexMcp.x,
      thumbIp.y - indexMcp.y
    );
    const distanceCheck = thumbTipToIndexDist > thumbIpToIndexDist * 1.15;

    // Horizontal extension check
    const horizontalExtension = isRightHand
      ? thumbTip.x < thumbMcp.x - 0.03
      : thumbTip.x > thumbMcp.x + 0.03;

    // Wrist distance check: extended thumb should be farther from wrist
    const thumbTipToWrist = Math.hypot(
      thumbTip.x - wrist.x,
      thumbTip.y - wrist.y
    );
    const thumbMcpToWrist = Math.hypot(
      thumbMcp.x - wrist.x,
      thumbMcp.y - wrist.y
    );
    const wristDistanceCheck = thumbTipToWrist > thumbMcpToWrist * 1.05;

    // Use 2 out of 3 checks for balanced detection
    let checksPassedCount = 0;
    if (distanceCheck) checksPassedCount++;
    if (horizontalExtension) checksPassedCount++;
    if (wristDistanceCheck) checksPassedCount++;
    const thumbExtended = checksPassedCount >= 2;

    // Check other fingers (index, middle, ring, pinky) with stricter criteria
    const fingerTips = [8, 12, 16, 20];
    const fingerPips = [6, 10, 14, 18];
    const fingerMcps = [5, 9, 13, 17];
    const fingersExtended: boolean[] = [];

    for (let i = 0; i < fingerTips.length; i++) {
      const tip = landmarks[fingerTips[i]];
      const pip = landmarks[fingerPips[i]];
      const mcp = landmarks[fingerMcps[i]];

      // Stricter checks: tip must be clearly above PIP and MCP
      const tipAbovePip = tip.y < pip.y - 0.02; // Increased threshold
      const tipAboveMcp = tip.y < mcp.y - 0.01; // Added threshold

      // Additional check: tip should be significantly farther from wrist than pip
      const tipToWrist = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
      const pipToWrist = Math.hypot(pip.x - wrist.x, pip.y - wrist.y);
      const extensionCheck = tipToWrist > pipToWrist * 0.95;

      fingersExtended.push(tipAbovePip && tipAboveMcp && extensionCheck);
    }

    return {
      thumb: thumbExtended,
      index: fingersExtended[0],
      middle: fingersExtended[1],
      ring: fingersExtended[2],
      pinky: fingersExtended[3],
    };
  }

  /**
   * Validate specific finger combination for verification steps
   * Step 1: Index, Middle, Ring only (3 fingers)
   * Step 2: Index, Middle only (2 fingers)
   * Step 3: Index only (1 finger)
   */
  validateFingerCombination(
    result: GestureRecognizerResult | null,
    step: 1 | 2 | 3
  ): boolean {
    const fingers = this.detectExtendedFingers(result);
    if (!fingers) {
      return false;
    }

    let isValid = false;

    switch (step) {
      case 1: // Three fingers: Index, Middle, Ring only
        isValid =
          !fingers.thumb &&
          fingers.index &&
          fingers.middle &&
          fingers.ring &&
          !fingers.pinky;
        console.log(
          "✋ Step 1 validation (Index+Middle+Ring):",
          isValid ? "✅ PASS" : "❌ FAIL",
          fingers
        );
        break;

      case 2: // Two fingers: Index, Middle only
        isValid =
          !fingers.thumb &&
          fingers.index &&
          fingers.middle &&
          !fingers.ring &&
          !fingers.pinky;
        console.log(
          "✌️ Step 2 validation (Index+Middle):",
          isValid ? "✅ PASS" : "❌ FAIL",
          fingers
        );
        break;

      case 3: // One finger: Index only
        isValid =
          !fingers.thumb &&
          fingers.index &&
          !fingers.middle &&
          !fingers.ring &&
          !fingers.pinky;
        console.log(
          "☝️ Step 3 validation (Index only):",
          isValid ? "✅ PASS" : "❌ FAIL",
          fingers
        );
        break;
    }

    return isValid;
  }

  /**
   * Count the number of extended fingers based on hand landmarks
   * Returns the finger count or null if no hand is detected
   * @deprecated Use detectExtendedFingers() for more precise control
   */
  countFingers(result: GestureRecognizerResult | null): number | null {
    const fingers = this.detectExtendedFingers(result);
    if (!fingers) {
      return null;
    }

    const fingerCount = Object.values(fingers).filter(Boolean).length;
    const extendedNames = Object.entries(fingers)
      .filter(([_, extended]) => extended)
      .map(([name, _]) => name);

    console.log(
      "🖐️ Finger count:",
      fingerCount,
      "Extended:",
      extendedNames.join(", ")
    );
    return fingerCount;
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    console.log("🧹 Cleaning up hand gesture detector");
    if (this.gestureRecognizer) {
      try {
        this.gestureRecognizer.close();
        console.log("✅ Gesture recognizer closed");
      } catch (error) {
        console.warn("⚠️ Error closing gesture recognizer:", error);
      }
      this.gestureRecognizer = null;
    }
    this.isInitialized = false;
    this.lastLogTime = 0;
    console.log("✅ Cleanup complete, ready for reinitialization");
  }
}

// Export a singleton instance
export const handGestureDetector = new HandGestureDetection();
