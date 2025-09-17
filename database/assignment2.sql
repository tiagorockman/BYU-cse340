
/* 1) Create Tony Stark*/
INSERT INTO public.account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
)

-- 2) Modify Tony Stark to Admin
UPDATE public.account
SET account_type = 'Admin'::account_type
WHERE account_firstname = 'Tony'
  AND account_lastname  = 'Stark'
  AND account_email     = 'tony@starkent.com';

-- 3) Delete Tony Stark
DELETE FROM  public.account
WHERE account_firstname = 'Tony'
  AND account_lastname  = 'Stark'
  AND account_email     = 'tony@starkent.com';

--SELECT * from public.account 

--4)  Update the description for the GM Hummer
-- select inv_description FROM inventory WHERE inv_make = 'GM' AND inv_model = 'Hummer';

UPDATE
  inventory
SET
  inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE
  inv_make = 'GM' AND inv_model = 'Hummer';

--6) Add '/vehicles' to all image and thumbnail paths
UPDATE
  inventory
SET
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

-- select inv_image, inv_thumbnail from inventory