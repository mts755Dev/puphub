INSERT INTO users (username, 
                    password, 
                    first_name, 
                    last_name, 
                    email, 
                    is_admin)
VALUES ('testuser',
        'testpassword',
        'Test',
        'User',
        'test@tester.com',
        FALSE),
        ('testadmin',
        'adminpassword',
        'Test',
        'Admin',
        'admin@tester.com',
        TRUE),
        ('michelle',
        'password',
        'Michelle', 
        'Mason',
        'michelle@gmail.com',
        FALSE);

-- SHOULD I ADD OWNER_ID TO DOGS?
INSERT INTO dogs (name,
                age,
                breed,
                gender,
                image,
                user_id)
VALUES ('Walnut', '2', 'Collie', 'Male', 'https://image.petmd.com/files/styles/863x625/public/2022-10/collie-dog.jpg', 'michelle'),
('Winston', '5', 'Bernese Mountain Dog', 'Male', 'https://images.prismic.io/luko/5f372e3d-fcad-4557-8c68-7a4175954265_Bernese-Mountain-Dog-1.jpg', 'michelle'),
('Whiskey', '7', 'Black Lab', 'Male', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Black_Labrador_Retriever_portrait.jpg/600px-Black_Labrador_Retriever_portrait.jpg', 'michelle')

-- ASK JULIE, HOW CAN I SET IT UP WHERE ONE USER CAN HAVE MULTIPLE DOGS