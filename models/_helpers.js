exports.slugify = async function(next) {
  if (!this.isModified('title')) {
    // title not modified
    return next()
  }
  this.slug = slug(this.title)

  // find other lists that have the same slug
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const mathchesWithSlug = await this.constructor.find({ slug: slugRegEx });

  // If a slug already exists, add an incremented number to the end
  if (mathchesWithSlug.length) {
    this.slug =`${this.slug}-${mathchesWithSlug.length + 1}`
  }

  next();
}