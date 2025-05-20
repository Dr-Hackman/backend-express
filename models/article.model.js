class Article {
    constructor(id=null, title, description, image_url, author_id, published_at) {
        this.title = title;
        this.description = description;
        this.image_url = image_url;
        this.author_id = author_id;
        this.published_at = published_at;
    }
}

module.exports = Article;