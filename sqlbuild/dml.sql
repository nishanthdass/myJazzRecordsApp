-- Collections Data Manipulation Queries

-- Browse

Select * from Collections;

SELECT * FROM Collections WHERE name LIKE "%${:name}%";

SELECT Listeners.name AS ListName, Albums.name, Albums.album_id , Performance_Ratings.performances_albums_album_id, SUM(Performance_Ratings.rating) AS rating, Performances.musicians_musician_id, Musicians.first_name, Musicians.last_name
    FROM Listeners 
        INNER JOIN Performance_Ratings 
            ON Listeners.collections_collection_id = Performance_Ratings.collections_collection_id
        INNER JOIN Albums
            ON Performance_Ratings.Performances_albums_album_id = Albums.album_id
        INNER JOIN Performances
            ON Albums.album_id = Performances.albums_album_id
        INNER Join Musicians
            ON Performances.musicians_musician_id = Musicians.musician_id
    WHERE Listeners.name = (SELECT name FROM Listeners WHERE collections_collection_id = ${collectionId})
    GROUP BY Musicians.musician_id
    ORDER BY rating DESC;


-- Insert
INSERT INTO Collections (name)
VALUES (:name);



-- Update

UPDATE Collections
SET name = :name
WHERE collection_id = :collection_id;


-- Delete
DELETE FROM Collections WHERE collection_id = :collection_id;



-- Listeners Data Manipulation Queries

-- Browse
SELECT Listeners.listeners_id, Listeners.name, Listeners.email, Listeners.collections_collection_id, Collections.name AS collection_name FROM Listeners LEFT JOIN Collections ON Listeners.collections_collection_id = Collections.collection_id;

-- Insert
INSERT INTO Listeners (name, email, collections_collection_id) VALUES
(:name, :email, :collections_collection_id);

INSERT INTO Listeners (name, email, collections_collection_id) VALUES (:name, :email, (SELECT collection_id FROM Collections WHERE collection_id = (SELECT last_insert_id())));

-- Update
UPDATE Listeners SET name = :name, email = :email, collections_collection_id = :collections_collection_id WHERE listeners_id = :listener_id;



-- Delete (If we delete a Listener then this delete the listeners collection)
DELETE FROM Listeners WHERE listener_id: :listener_id;



-- Genres Data Manipulation Queries

-- Browse 
Select * from Genres;

-- Insert
INSERT INTO Genres (name) VALUES (:name);

-- Update
UPDATE Genres
SET name = :name
WHERE genre_id = :genre_id;

-- Delete
DELETE FROM Genres WHERE genre_id = :genre_id;




-- Musicians Data Manipulation Queries

-- Browse
Select * from Musicians ORDER BY musician_id;

-- Insert
INSERT INTO `Musicians` (`first_name`, `last_name`, `instrument`) VALUES
(:first_name, :last_name, :instrument);

-- Update
UPDATE Musicians SET first_name = :first_name, last_name = :last_name, instrument = :instrument WHERE musician_id = :musician_id


-- Delete
DELETE FROM Musicians WHERE musician_id = :musician_id;



-- Albums Data Manipulation Queries

-- Browse
SELECT Albums.album_id, Albums.name, Albums.recording_year, Albums.release_year, Albums.genres_genre_id, Genres.name AS genname, Albums.bandleader_id, Musicians.first_name, Musicians.last_name FROM Albums LEFT JOIN Genres ON Albums.genres_genre_id = Genres.genre_id LEFT JOIN Musicians ON Albums.bandleader_id = Musicians.musician_id ORDER BY Albums.album_id;


-- -- Insert
INSERT INTO Albums (name, recording_year, release_year, genres_genre_id, bandleader_id) 
        VALUES (:name, :recording_year, :release_year, :genres_genre_id, :bandleader_id);

-- Update
UPDATE Albums SET name = :name, recording_year = :recording_year, release_year = :release_year, genres_genre_id = (SELECT genre_id from Genres WHERE name = :name), bandleader_id = (SELECT musician_id From Musicians WHERE first_name = :first_name AND last_name = :last_name )  WHERE album_id = :album_id;

-- -- Delete
DELETE FROM Albums WHERE album_id = :album_id;



-- Performances Data Manipulation Queries

-- Browse
SELECT Performances.performance_id, Performances.musicians_musician_id, Musicians.first_name, Musicians.last_name, Performances.albums_album_id, Albums.name From Performances INNER JOIN Musicians ON Performances.musicians_musician_id = Musicians.musician_id INNER JOIN Albums ON Performances.albums_album_id = Albums.album_id;

-- Insert
INSERT INTO `Performances`(`musicians_musician_id`, `albums_album_id`) VALUES
((SELECT musician_id from Musicians where first_name = :first_name and last_name = :last_name), 
 (SELECT album_id from Albums where name = :name )
 );

-- Delete

DELETE from Performances WHERE performance_id = :performance_id;



-- Performace_Ratings Data Manipulation Queries

-- Browse
SELECT Performance_Ratings.performance_rating_id, Performance_Ratings.collections_collection_id, Collections.name AS ColName, Performance_Ratings.performances_albums_album_id, Albums.name as AlbName, Performance_Ratings.rating From Performance_Ratings INNER JOIN Collections ON Performance_Ratings.collections_collection_id = Collections.collection_id INNER JOIN Albums ON Performance_Ratings.performances_albums_album_id = Albums.album_id ORDER BY Performance_Ratings.performance_rating_id;


-- Insert
INSERT INTO Performance_Ratings (collections_collection_id, performances_albums_album_id, rating) VALUES (:collections_collection_id, :performances_albums_album_id, :rating);


-- Update
UPDATE Performance_Ratings SET collections_collection_id = (SELECT collection_id from Collections WHERE name = :name), performances_albums_album_id = (SELECT album_id from Albums where name = :name), rating = :rating WHERE performance_rating_id = :performance_rating_id;

-- Delete

DELETE FROM Performance_Ratings WHERE performance_rating_id = :performance_rating_id
