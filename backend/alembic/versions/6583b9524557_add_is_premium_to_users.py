"""Add is_premium to users

Revision ID: 6583b9524557
Revises: 16f8ac73d915
Create Date: 2025-06-06 15:19:58.305288
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '6583b9524557'
down_revision: Union[str, None] = '16f8ac73d915'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name='users' AND column_name='is_premium'
            ) THEN
                ALTER TABLE users ADD COLUMN is_premium BOOLEAN NOT NULL DEFAULT FALSE;
            END IF;
        END$$;
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'is_premium')
