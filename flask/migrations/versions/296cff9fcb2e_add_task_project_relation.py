"""add task-project relation

Revision ID: 296cff9fcb2e
Revises: 7c30d7d872cc
Create Date: 2023-07-08 06:17:03.522554

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '296cff9fcb2e'
down_revision = '7c30d7d872cc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('project_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'projects', ['project_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('project_id')

    # ### end Alembic commands ###
