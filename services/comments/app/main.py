from fastapi import FastAPI

app = FastAPI(title="Comments Service")

@app.get("/health")
def health():
    return {"status": "ok", "service": "comments"}

@app.get("/comments")
def list_comments():
    return [
        {"id": 1, "text": "Great post!", "postId": 1, "userId": 1},
        {"id": 2, "text": "Very informative", "postId": 1, "userId": 2},
        {"id": 3, "text": "Thanks for sharing", "postId": 2, "userId": 3},
        {"id": 4, "text": "Looking forward to more content", "postId": 3, "userId": 1}
    ]

@app.get("/comments/{comment_id}")
def get_comment(comment_id: int):
    comments = [
        {"id": 1, "text": "Great post!", "postId": 1, "userId": 1},
        {"id": 2, "text": "Very informative", "postId": 1, "userId": 2},
        {"id": 3, "text": "Thanks for sharing", "postId": 2, "userId": 3},
        {"id": 4, "text": "Looking forward to more content", "postId": 3, "userId": 1}
    ]
    
    comment = next((c for c in comments if c["id"] == comment_id), None)
    if not comment:
        return {"error": "Comment not found"}, 404
        
    return comment

@app.get("/comments/post/{post_id}")
def get_comments_by_post(post_id: int):
    comments = [
        {"id": 1, "text": "Great post!", "postId": 1, "userId": 1},
        {"id": 2, "text": "Very informative", "postId": 1, "userId": 2},
        {"id": 3, "text": "Thanks for sharing", "postId": 2, "userId": 3},
        {"id": 4, "text": "Looking forward to more content", "postId": 3, "userId": 1}
    ]
    
    post_comments = [c for c in comments if c["postId"] == post_id]
    return post_comments