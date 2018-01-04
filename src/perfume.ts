declare global {
  interface Window { ga: any; }
}

export default class Perfume {
  public firstPaintDuration: number = 0;
  public googleAnalytics: {
    enable: boolean;
    timingVar: string;
  } = {
    enable: false,
    timingVar: "name",
  };
  private metrics: {
    [key: string]: {
      start: number;
      end: number;
    };
  } = {};
  private logPrefix: string = "⚡️ Perfume.js:";

  constructor() {
    if (!this.supportsPerfNow) {
      global.console.warn(this.logPrefix, "Cannot be used in this browser.");
    }
  }

  /**
   * True if the browser supports the Navigation Timing API.
   * @type {boolean}
   */
  get supportsPerfNow(): boolean {
    return window.performance && performance.now ? true : false;
  }

  /**
   * True if the browser supports the User Timing API.
   * Support: developer.mozilla.org/en-US/docs/Web/API/Performance/mark
   * @type {boolean}
   */
  get supportsPerfMark(): boolean {
    return window.performance && performance.mark ? true : false;
  }

  /**
   * Start performance measurement
   * @param {string} metricName
   */
  public start(metricName: string) {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    if (!this.supportsPerfMark) {
      global.console.warn(this.logPrefix, `Timeline won't be marked for "${metricName}".`);
    }
    if (this.metrics[metricName]) {
      global.console.warn(this.logPrefix, "Recording already started.");
      return;
    }
    this.metrics[metricName] = {
      end: 0,
      start: this.performanceNow(),
    };
    this.mark(metricName, "start");
  }

  /**
   * End performance measurement
   * @param {string} metricName
   * @param {boolean} log
   */
  public end(metricName: string, log = false) {
    if (!this.checkMetricName(metricName)) {
      return;
    }
    if (!this.metrics[metricName]) {
      global.console.warn(this.logPrefix, "Recording already stopped.");
      return;
    }
    this.metrics[metricName].end = this.performanceNow();
    this.mark(metricName, "end");
    this.measure(metricName, "start", "end");
    const duration = this.getDurationByMetric(metricName);
    if (log) {
      this.log(metricName, duration);
    }
    delete this.metrics[metricName];
    this.sendTiming(metricName, duration);
    return duration;
  }

  /**
   * End performance measurement after first paint from the beging of it
   * @param {string} metricName
   * @param {boolean} log
   */
  public endPaint(metricName: string, log = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const duration = this.end(metricName, log);
        resolve(duration);
      });
    });
  }

  /**
   * First Paint is essentially the paint after which
   * the biggest above-the-fold layout change has happened.
   */
  public firstPaint() {
    setTimeout(() => {
      this.firstPaintDuration = this.getFirstPaint();
      if (this.firstPaintDuration) {
        this.log("firstPaint", this.firstPaintDuration);
      }
      this.sendTiming("firstPaint", this.firstPaintDuration);
    });
  }

  /**
   * Coloring Text in Browser Console
   * @param {string} metricName
   * @param {number} duration
   */
  public log(metricName: string, duration: number) {
    if (!metricName || !duration) {
      global.console.warn(this.logPrefix, "Please provide a metric name and the duration value");
      return;
    }
    const durationMs = duration.toFixed(2);
    const style = "color: #ff6d00;font-size:12px;";
    const text = `%c ${this.logPrefix} ${metricName} ${durationMs} ms`;
    global.console.log(text, style);
  }

  /**
   * This assumes the user has made only one measurement for the given
   * name. Return the first PerformanceEntry objects for the given name.
   * @param {string} metricName
   */
  private getMeasurementForGivenName(metricName: string) {
    return performance.getEntriesByName(metricName)[0];
  }

  /**
   * Get the duration of the timing metric or -1 if there a measurement has
   * not been made. Use User Timing API results if available, otherwise return
   * performance.now() fallback.
   * @param {string} metricName
   */
  private getDurationByMetric(metricName: string) {
    if (this.supportsPerfMark) {
      const entry = this.getMeasurementForGivenName(metricName);
      if (entry && entry.entryType !== "measure") {
        return entry.duration;
      }
    }
    const duration = this.metrics[metricName].end - this.metrics[metricName].start;
    return duration || -1;
  }

  /**
   * @param {string} metricName
   */
  private checkMetricName(metricName: string) {
    if (metricName) {
      return true;
    }
    global.console.warn(this.logPrefix, "Please provide a metric name");
    return false;
  }

  /**
   * When performance API available:
   * - Returns a DOMHighResTimeStamp, measured in milliseconds, accurate to five
   *   thousandths of a millisecond (5 microseconds).
   * Otherwise:
   * - Unlike returns Date.now that is limited to one-millisecond resolution.
   * @type {number}
   */
  private performanceNow(): number {
    if (this.supportsPerfMark) {
      return window.performance.now();
    } else {
      return Date.now() / 1000;
    }
  }

  /**
   * @param {string} metricName
   * @param {string} type
   */
  private mark(metricName: string, type: string) {
    if (!this.supportsPerfMark) {
      return;
    }
    const mark = `mark_${metricName}_${type}`;
    window.performance.mark(mark);
  }

  /**
   * @param {string} metricName
   * @param {string} startMark
   * @param {string} endMark
   */
  private measure(metricName: string, startType: string, endType: string) {
    if (!this.supportsPerfMark) {
      return;
    }
    const startMark = `mark_${metricName}_${startType}`;
    const endMark = `mark_${metricName}_${endType}`;
    window.performance.measure(metricName, startMark, endMark);
  }

  /**
   * http://msdn.microsoft.com/ff974719
   * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart
   */
  private getFirstPaint() {
    if (performance) {
      const navTiming = performance.timing;
      if (navTiming && navTiming.navigationStart !== 0) {
        return Date.now() - navTiming.navigationStart;
      }
    }
    return 0;
  }

  /**
   * Sends the User timing measure to Google Analytics.
   * ga('send', 'timing', [timingCategory], [timingVar], [timingValue])
   * timingCategory: metricName
   * timingVar: googleAnalytics.timingVar
   * timingValue: The value of duration rounded to the nearest integer
   * @param {string} metricName
   * @param {number} duration
   */
  private sendTiming(metricName: string, duration: number) {
    if (!this.googleAnalytics.enable) {
      return;
    }
    if (!window.ga) {
      global.console.warn(this.logPrefix, "Google Analytics has not been loaded");
      return;
    }
    const durationInteger = Math.round(duration);
    window.ga("send", "timing", metricName, this.googleAnalytics.timingVar, durationInteger);
  }
}
