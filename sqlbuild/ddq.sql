-- SET FOREIGN_KEY_CHECKS=0;
-- SET AUTOCOMMIT = 0;
-- Drop Tables IF EXISTS Albums, Collections, Genres, Listeners, Musicians, Performance_Ratings, Performances;


CREATE TABLE IF NOT EXISTS `Collections` (
  `collection_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`collection_id`),
  UNIQUE INDEX `collection_id_UNIQUE` (`collection_id` ASC) VISIBLE)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `Listeners` (
  `listeners_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `collections_collection_id` INT NULL,
  PRIMARY KEY (`listeners_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  UNIQUE INDEX `listeners_id_UNIQUE` (`listeners_id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_Listeners_Collections1_idx` (`collections_collection_id` ASC) VISIBLE,
  CONSTRAINT `fk_Listeners_Collections1`
    FOREIGN KEY (`collections_collection_id`)
    REFERENCES `Collections` (`collection_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `Genres` (
  `genre_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`genre_id`),
  UNIQUE INDEX `genre_id_UNIQUE` (`genre_id` ASC) VISIBLE)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `Musicians` (
  `musician_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `instrument` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`musician_id`),
  UNIQUE INDEX `musician_id_UNIQUE` (`musician_id` ASC) VISIBLE,
  UNIQUE INDEX `unique_index` (`first_name` ASC, `last_name` ASC, `instrument` ASC) VISIBLE)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `Albums` (
  `album_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `recording_year` YEAR(4) NOT NULL,
  `release_year` YEAR(4) NULL DEFAULT recording_year,
  `genres_genre_id` INT NULL,
  `bandleader_id` INT NULL,
  PRIMARY KEY (`album_id`),
  UNIQUE INDEX `album_id_UNIQUE` (`album_id` ASC) VISIBLE,
  INDEX `fk_Albums_Genres1_idx` (`genres_genre_id` ASC) VISIBLE,
  UNIQUE INDEX `unique_index` (`name` ASC) VISIBLE,
  INDEX `fk_Albums_Musicians1_idx` (`bandleader_id` ASC) VISIBLE,
  CONSTRAINT `fk_Albums_Genres1`
    FOREIGN KEY (`genres_genre_id`)
    REFERENCES `Genres` (`genre_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Albums_Musicians1`
    FOREIGN KEY (`bandleader_id`)
    REFERENCES `Musicians` (`musician_id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `Performances` (
  `performance_id` INT NOT NULL AUTO_INCREMENT,
  `musicians_musician_id` INT NULL,
  `albums_album_id` INT NULL,
  PRIMARY KEY (`performance_id`, `musicians_musician_id`, `albums_album_id`),
  INDEX `fk_Musicians_has_Albums_Albums1_idx` (`albums_album_id` ASC) VISIBLE,
  INDEX `fk_Musicians_has_Albums_Musicians1_idx` (`musicians_musician_id` ASC) VISIBLE,
  UNIQUE INDEX `performance_id_UNIQUE` (`performance_id` ASC) VISIBLE,
  CONSTRAINT `fk_Musicians_has_Albums_Musicians1`
    FOREIGN KEY (`musicians_musician_id`)
    REFERENCES `Musicians` (`musician_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Musicians_has_Albums_Albums1`
    FOREIGN KEY (`albums_album_id`)
    REFERENCES `Albums` (`album_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `Performance_Ratings` (
  `performance_rating_id` INT NOT NULL AUTO_INCREMENT,
  `collections_collection_id` INT NOT NULL,
  `performances_albums_album_id` INT NOT NULL,
  `rating` TINYINT(5) NOT NULL,
  CONSTRAINT `Performance_Ratings` UNIQUE (`collections_collection_id`,`performances_albums_album_id`),
  PRIMARY KEY (`performance_rating_id`),
  INDEX `fk_Collections_has_Performances1_Performances1_idx` (`performances_albums_album_id` ASC) VISIBLE,
  INDEX `fk_Collections_has_Performances1_Collections1_idx` (`collections_collection_id` ASC) VISIBLE,
  UNIQUE INDEX `performance_rating_id_UNIQUE` (`performance_rating_id` ASC) VISIBLE,
  CONSTRAINT `fk_Collections_has_Performances1_Collections1`
    FOREIGN KEY (`collections_collection_id`)
    REFERENCES `Collections` (`collection_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Collections_has_Performances1_Performances1`
    FOREIGN KEY (`performances_albums_album_id`)
    REFERENCES `Performances` (`albums_album_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- SET FOREIGN_KEY_CHECKS=1;
-- COMMIT;


INSERT INTO `Collections` (`name`) VALUES
("Beth Bags' Bag of Tracks"),
("Loni's Library"),
("Tinitus Tunes");

INSERT INTO `Listeners` (`name`, `email`, `collections_collection_id`) VALUES
('Beth Bagley', 'bagley.beth@gmail.com', (SELECT collection_id From Collections WHERE name = "Beth Bags' Bag of Tracks")),
('Loni McCarron', 'LMcCar@servicepartners.net', (SELECT collection_id From Collections WHERE name = "Loni's Library")),
('James Battat', 'jbattat@welesley.edu', (SELECT collection_id From Collections WHERE name = "Tinitus Tunes"));

INSERT INTO Collections (name) VALUES
('My Generic Collection Name');

INSERT INTO Listeners (name, email, collections_collection_id) VALUES
('Ani Aklian', 'aaklian@test.net', (SELECT MAX(collection_id) from Collections));

INSERT INTO `Genres`(`name`) VALUES 
("Hard Bop"), ("Modal"), ("Fusion");

INSERT INTO `Musicians` (`first_name`, `last_name`, `instrument`) VALUES
('Miles', 'Davis', 'Trumpet'),
('Art', 'Blakey', 'Drums'),
('Bill', 'Evans', 'Piano'),
('Haruomi', 'Hosono', 'Guitar'),
('Cannonball', 'Adderley', 'Saxophone'),
('Kamasi ', 'Washington', 'Saxophone');


INSERT INTO `Albums` (`name`, `recording_year`, `release_year`, `bandleader_id`, `genres_genre_id`) VALUES
('Kind of Blue', 1959, 1959, (SELECT musician_id from Musicians where first_name = "Miles" and last_name = "Davis"), (SELECT genre_id from Genres WHERE name = "Modal")),
("Somethin' Else", 1958, 1958, (SELECT musician_id from Musicians where first_name = "Cannonball" and last_name = "Adderley"), (SELECT genre_id from Genres WHERE name = "Hard Bop")),
('Portrait In Jazz', 1959, 1960, (SELECT musician_id from Musicians where first_name = "Bill" and last_name = "Evans"), (SELECT genre_id from Genres WHERE name = "Hard Bop")),
('Paraiso',	1978,	1978,	(SELECT musician_id from Musicians where first_name = "Haruomi" and last_name = "Hosono"), (SELECT genre_id from Genres WHERE name = "Fusion"));


INSERT INTO `Performances`(`musicians_musician_id`, `albums_album_id`) VALUES
((SELECT musician_id from Musicians where first_name = "Miles" and last_name = "Davis"), 
 (SELECT album_id from Albums where name = "Kind of Blue")
 ),
 ((SELECT musician_id from Musicians where first_name = "Miles" and last_name = "Davis"), 
 (SELECT album_id from Albums where name = "Somethin' Else")
 ),
 ((SELECT musician_id from Musicians where first_name = "Art" and last_name = "Blakey"), 
 (SELECT album_id from Albums where name = "Somethin' Else")
 ),
 ((SELECT musician_id from Musicians where first_name = "Bill" and last_name = "Evans"), 
 (SELECT album_id from Albums where name = "Kind of Blue")
 ),
 ((SELECT musician_id from Musicians where first_name = "Haruomi" and last_name = "Hosono"), 
 (SELECT album_id from Albums where name = "Paraiso")
 );


INSERT INTO `Performance_Ratings`(`collections_collection_id`, `performances_albums_album_id`, `rating`) VALUES 
((SELECT collection_id From Collections WHERE name = "Beth Bags' Bag of Tracks"),
(SELECT album_id from Albums where name = "Kind of Blue"),
 5), 
((SELECT collection_id From Collections WHERE name = "Beth Bags' Bag of Tracks"),
(SELECT album_id from Albums where name = "Somethin' Else"),
 4), 
((SELECT collection_id From Collections WHERE name = "Beth Bags' Bag of Tracks"),
(SELECT album_id from Albums where name = "Paraiso"),
 5), 
((SELECT collection_id From Collections WHERE name = "Loni's Library"), 
(SELECT album_id from Albums where name = "Paraiso"),
 5), 
((SELECT collection_id From Collections WHERE name = "Loni's Library"),
(SELECT album_id from Albums where name = "Kind of Blue"),
 2);
