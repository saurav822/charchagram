const post = {
    "message": "Posts retrieved successfully",
    "data": {
        "posts": [
            {
                "_id": "68a9cdb0e8a0ae5e74797eb1",
                "title": "Sample Post Title456",
                "description": "This is a sample post description456",
                "content": "This is the main content of the post. It can be much longer and contain detailed information about the topic.",
                "author": {
                    "_id": "68a733a6ea0064119890ac1d",
                    "name": "John Doe"
                },
                "views": 0,
                "comments": [
                    {
                        "_id": "68a9d1ba7dba82677cac899b",
                        "user": {
                            "_id": "68a733a6ea0064119890ac1d",
                            "name": "John Doe"
                        },
                        "content": "This is a comment on the post. It can be up to 1000 characters long.322",
                        "createdAt": "2025-08-23T14:35:38.412Z"
                    },
                    {
                        "_id": "68a9cdb8e8a0ae5e74797eb7",
                        "user": {
                            "_id": "68a733a6ea0064119890ac1d",
                            "name": "John Doe"
                        },
                        "content": "This is a comment on the post. It can be up to 1000 characters long.322",
                        "createdAt": "2025-08-23T14:18:32.107Z"
                    }
                ],
                "commentCount": 2,
                "link": "https://example.com/article",
                "like": [],
                "dislike": [],
                "constituency": {
                    "_id": "68a5a8c7490318f6924bdd4e",
                    "area_name": "अगिआंव"
                },
                "tags": [],
                "createdAt": "2025-08-23T14:18:24.872Z",
                "updatedAt": "2025-08-23T14:18:24.872Z",
                "__v": 0
            },
            {
                "_id": "68a9cc19f1dd948538f76646",
                "title": "Sample Post Title456",
                "description": "This is a sample post description123",
                "content": "This is the main content of the post. It can be much longer and contain detailed information about the topic.",
                "author": {
                    "_id": "68a733a6ea0064119890ac1d",
                    "name": "John Doe"
                },
                "views": 0,
                "comments": [],
                "commentCount": 0,
                "link": "https://example.com/article",
                "like": [],
                "dislike": [],
                "constituency": {
                    "_id": "68a5a8c7490318f6924bdd4e",
                    "area_name": "अगिआंव"
                },
                "tags": [],
                "createdAt": "2025-08-23T14:11:37.598Z",
                "updatedAt": "2025-08-23T14:11:37.598Z",
                "__v": 0
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalPosts": 2,
            "hasNextPage": false,
            "hasPrevPage": false,
            "limit": 10
        }
    }
}