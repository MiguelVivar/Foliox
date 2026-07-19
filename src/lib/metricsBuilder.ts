export type MetricsTemplate = "default" | "compact" | "minimalist";

export interface MetricsOptions {
  template: MetricsTemplate;
  showStats?: boolean;
  showLanguages?: boolean;
  showTrophies?: boolean;
  showContributions?: boolean;
}

const TEMPLATE_CONFIG: Record<MetricsTemplate, string> = {
  default: "classic",
  compact: "terminal",
  minimalist: "classic&config.padding=0",
};

export function buildMetricsUrl(username: string, options: MetricsOptions): string {
  const baseUrl = "https://metrics.lecoq.io";
  const params = new URLSearchParams();

  params.set("user", username);
  params.set("template", TEMPLATE_CONFIG[options.template]);
  params.set("config.timezone", "America/New_York");

  if (options.showStats !== false) {
    params.append("plugin", "lines");
  }

  if (options.showLanguages !== false) {
    params.append("plugin", "languages");
  }

  if (options.showTrophies !== false) {
    params.append("plugin", "achievements");
  }

  if (options.showContributions !== false) {
    params.append("plugin", "calendar");
    params.set("plugin.calendar.limit", "4");
  }

  return `${baseUrl}/svg?${params.toString()}`;
}

export function getDefaultOptions(): MetricsOptions {
  return {
    template: "default",
    showStats: true,
    showLanguages: true,
    showTrophies: false,
    showContributions: true,
  };
}
