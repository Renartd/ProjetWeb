CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    -- Empêche un utilisateur de s'inscrire deux fois
    CONSTRAINT unique_registration UNIQUE (user_id, event_id),

    -- Clés étrangères
    CONSTRAINT fk_registration_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_registration_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
);
