export default class Project {
  constructor(record) {
    this.id = record.id;
    this.title = record.title;
    this.subtitle = record.subtitle;
    this.description = record.description;
    this.longDescription = record.longDescription;
    this.tags = Object.freeze([...(record.tags ?? [])]);
    this.icon = record.icon ?? null;
    this.image = record.image ?? null;
    this.imageAlt = record.imageAlt ?? "";
    this.color = record.color;
    this.status = record.status;
    this.github = record.github ?? null;
    this.demo = record.demo ?? null;
    this.features = Object.freeze([...(record.features ?? [])]);
    this.stack = Object.freeze(
      Object.entries(record.stack ?? {}).reduce((stack, [layer, techs]) => {
        stack[layer] = Object.freeze([...(techs ?? [])]);
        return stack;
      }, {})
    );

    Object.freeze(this);
  }

  static from(record) {
    return record instanceof Project ? record : new Project(record);
  }

  matchesId(id) {
    return this.id === id;
  }

  matchesStatus(status) {
    return status === "All" || this.status === status;
  }

  matchesQuery(query) {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return [
      this.title,
      this.subtitle,
      this.description,
      this.status,
      ...this.tags,
      ...Object.values(this.stack).flat(),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  }

  hasIcon() {
    return Boolean(this.icon);
  }

  hasPreviewImage() {
    return Boolean(this.image);
  }

  hasFeatures() {
    return this.features.length > 0;
  }

  hasGithub() {
    return Boolean(this.github);
  }

  getDetailPath() {
    return `/projects/${this.id}`;
  }

  getPreviewHref() {
    return this.demo || this.image;
  }

  getPreviewLabel() {
    return this.demo ? "Live Demo ↗" : "Demo Preview ↗";
  }

  getPreviewAlt() {
    return this.imageAlt || `${this.title} preview`;
  }

  getStackEntries() {
    return Object.entries(this.stack).filter(([, techs]) => techs.length > 0);
  }
}
