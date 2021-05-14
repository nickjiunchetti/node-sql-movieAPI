# How to test this api

You will need Docker and Docker Composer installed locally.

# Steps:

1 - clone the repository:
2 - execute docker: docker-compose up
3 - Open postman
4 - Import postman collections from the repository

# You can explore the API freely and navigate via the response messages, or you can use the automated tests.

> To run the automated tests, be sure to do it before navigating the api, or delete the docker volume(docker volume rm "docker.mysql.container") before testing, to make sure the database its in the expected state

> To run the automated tests:

5 - Click on Movie API Collection
6 - Click on Run
7 - Move all the delete requisitions to the **BOTTOM** of the run order, keep them in the following order:

- Delete Evaluation

- Delete Movie from Wishlist
- Delete Wishlist

- Delete Movie from Watchlist
- Delete Watchlist

- Delete Post From Group
- Delete User from Group
- Delete Group

- Delete User

> The tests expect most crud operations to suceed, and some to return 406 status.
