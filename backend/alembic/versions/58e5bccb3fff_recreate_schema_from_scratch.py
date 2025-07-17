"""Recreate schema from scratch

Revision ID: 58e5bccb3fff
Revises:
Create Date: 2025-05-30 23:11:46.894443
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '58e5bccb3fff'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: create users and journal_entries tables."""

    # Create 'users' table if not exists
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users') THEN
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR NOT NULL UNIQUE,
                    hashed_password VARCHAR NOT NULL,
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    is_premium BOOLEAN,
                    feedback_count INTEGER
                );
            END IF;
        END
        $$;
    """)

    # Create 'journal_entries' table if not exists
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'journal_entries') THEN
                CREATE TABLE journal_entries (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    content TEXT NOT NULL,
                    timestamp TIMESTAMP NOT NULL,
                    feedback TEXT
                );
            END IF;
        END
        $$;
    """)


def downgrade() -> None:
    """Downgrade schema: drop journal_entries and users tables."""

    op.drop_table('journal_entries')
    op.drop_table('users')
