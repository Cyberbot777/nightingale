"""Add feedback_count to User

Revision ID: 596b63e7f2f0
Revises: 58e5bccb3fff
Create Date: 2025-05-31 02:14:02.292200
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '596b63e7f2f0'
down_revision: Union[str, None] = '58e5bccb3fff'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table('journal_entries', schema=None) as batch_op:
        batch_op.alter_column('user_id',
            existing_type=sa.INTEGER(),
            nullable=False
        )

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('feedback_count',
            existing_type=sa.INTEGER(),
            nullable=False
        )

def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('feedback_count',
            existing_type=sa.INTEGER(),
            nullable=True
        )

    with op.batch_alter_table('journal_entries', schema=None) as batch_op:
        batch_op.alter_column('user_id',
            existing_type=sa.INTEGER(),
            nullable=True
        )
