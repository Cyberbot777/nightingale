"""Add password reset token table

Revision ID: 16f8ac73d915
Revises: fad8924dbe87
Create Date: 2025-06-05 22:33:46.562155
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '16f8ac73d915'
down_revision: Union[str, None] = 'fad8924dbe87'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    # Create table if not exists to avoid DuplicateTable error
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_name = 'password_reset_tokens'
            ) THEN
                CREATE TABLE password_reset_tokens (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id),
                    token VARCHAR UNIQUE NOT NULL,
                    expires_at TIMESTAMP NOT NULL
                );
            END IF;
        END
        $$;
    """)

    # Make additional schema changes
    op.alter_column('journal_entries', 'content',
        existing_type=sa.TEXT(),
        nullable=False
    )
    op.alter_column('users', 'hashed_password',
        existing_type=sa.VARCHAR(),
        type_=sa.Text(),
        existing_nullable=False
    )

def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('users', 'hashed_password',
        existing_type=sa.Text(),
        type_=sa.VARCHAR(),
        existing_nullable=False
    )
    op.alter_column('journal_entries', 'content',
        existing_type=sa.TEXT(),
        nullable=True
    )
    op.drop_table('password_reset_tokens')
