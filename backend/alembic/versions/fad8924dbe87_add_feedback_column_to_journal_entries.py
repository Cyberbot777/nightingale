"""add feedback column to journal_entries

Revision ID: fad8924dbe87
Revises: 596b63e7f2f0
Create Date: 2025-05-31 14:42:20.488114
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'fad8924dbe87'
down_revision: Union[str, None] = '596b63e7f2f0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Only add column if it does not already exist
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'journal_entries' 
                AND column_name = 'feedback'
            ) THEN
                ALTER TABLE journal_entries ADD COLUMN feedback VARCHAR;
            END IF;
        END
        $$;
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('journal_entries', 'feedback')
